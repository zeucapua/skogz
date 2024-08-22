<script lang="ts">
  import Counter from "./components/Counter.svelte";  

  let { heads, tails }: { heads: number, tails: number } = $props();
</script>

<h1>Counter page</h1>
<Counter count={heads} />

<p>Heads: {heads}</p>
<p>Tails: {tails}</p>

