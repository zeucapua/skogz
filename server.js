import fs from 'node:fs/promises'
import express from 'express'
import { render } from 'svelte/server'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined

// Create http server
const app = express()

// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');
    const path = req.baseUrl.trim().length === 0 ? '/' : req.baseUrl;

    let routes;
    let template;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)

      // Get the predetermined routes 
      routes = (await vite.ssrLoadModule('/src/skogz.ts')).routes;
    } else {
      template = templateHtml

      // Get the predetermined routes, via built files ('./dist')
      routes = (await import('./dist/server/skogz.ts')).routes;
    }


    // get the correct component from the set routes object 
    // if given URL is a key in the routes Object
    // else get the error component 
    let component = Object.keys(routes).find((route) => route === path)
      ? routes[path].page_component
      : routes.error.page_component

    let errorLog = () => console.log("NOPE");

    let loaderFn = Object.keys(routes).find((route) => route === path) ?
      (routes[path].loaderFn || errorLog) : errorLog;

    let result = await loaderFn();
    console.log({ result });

    // render the component
    const rendered = render(component, {
      props: { queryParams: req.query, ...result }
    });

    // replace parts of the document with rendered <head> and elements
    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.body ?? '')
      .replace(`<!--skogz-loader-result-->`, `<script>window.__skogzLoaderResult = ${JSON.stringify(result)}</script>`);


    // return the non-hydrated document back to the client
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
