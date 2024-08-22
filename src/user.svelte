<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteURL, SvelteURLSearchParams } from "svelte/reactivity";

  interface UserPageProps {
    queryParams: Record<string, any> // initial
  }

  let { queryParams }: UserPageProps = $props();
  let name = $state(queryParams.name);
</script>

<p>Hello {name}</p>

<input bind:value={name} />
