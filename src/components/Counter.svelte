<script lang="ts">
  let { count }: { count: number } = $props();
</script>

<button onclick={() => count++}>
  Count: {count}
</button>
