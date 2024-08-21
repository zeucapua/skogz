import Root from "./root.svelte";
import Pong from "./pong.svelte";
import User from "./user.svelte";
import Error from "./error.svelte";
import type { SvelteComponent } from "svelte";
import { hydrate } from "svelte";

// Define routes and the page component it should render
// Keys are routes, checked with the middleware in `./server.js`
export const routes : Record<string, { page_component: SvelteComponent }> = {
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
  error: {
    // @ts-ignore 
    page_component: Error
  }
} as const;


// Hydration: runs on `<script type="module">` in HTML
// "If typeof window !== 'undefined'" checks if this is ran on client, 
// NOT server, since this file is imported on both client and server side
if (typeof window !== "undefined") {
  let url = window.location.pathname;
  let searchParams = new URLSearchParams(window.location.search);
  let query = Object.fromEntries(searchParams.entries());

  let Page : SvelteComponent;
  if (Object.keys(routes).find((route) => route === url)) {
    Page = routes[url].page_component 
  }
  else {
    Page = routes.error.page_component
  }


  // Hydrate the correct component
  // @ts-ignore
  const app = hydrate(Page, {
    // @ts-ignore
    target: document.getElementById('app'),
    hydrate: true,
    props: query
  })
}
