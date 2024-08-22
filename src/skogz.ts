import { hydrate } from "svelte";
import Root from "./root.svelte";
import Pong from "./pong.svelte";
import User from "./user.svelte";
import Count from "./count.svelte";
import Error from "./error.svelte";
import type { SvelteComponent } from "svelte";

type Routes = Record<string, { 
  page_component: SvelteComponent,
  loader?: () => Record<string, any> 
}>;

// Define routes and the page component it should render
// Keys are routes, checked with the middleware in `./server.js`
export const routes: Routes = {
  "/": {
    // @ts-ignore 
    page_component: Root
  },
  "/pong": {
    // @ts-ignore 
    page_component: Pong
  },
  "/user": {
    // @ts-ignore 
    page_component: User
  },
  "/count": {
    // @ts-ignore 
    page_component: Count,
    loader: async () => {
      const response = await fetch("https://cf.willow.sh");
      const json = await response.json();
      return json;
    }
  },
  error: {
    // @ts-ignore 
    page_component: Error
  }
} as const;


// Hydration: runs on `<script type="module">` in HTML
// "If typeof window !== 'undefined'" checks if this is ran on client, 
// NOT server, since this file is imported on both client and server side
if (typeof window !== "undefined") {
  console.log(window.location);
  let url = window.location.pathname;
  let searchParams = new URLSearchParams(window.location.search);
  let query = Object.fromEntries(searchParams.entries());

  let Page : SvelteComponent;
  if (Object.keys(routes).find((route) => route === url)) {
    Page = routes[url].page_component;
  }
  else {
    Page = routes.error.page_component
  }

  let result = window.__skogzLoaderResult!;
  console.log({ result });

  // Hydrate the correct component
  // @ts-ignore
  const app = hydrate(Page, {
    // @ts-ignore
    target: document.getElementById('app'),
    hydrate: true,
    props: {
      queryParams: query,
      ...result
    }
  })
}
