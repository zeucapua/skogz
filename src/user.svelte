<script lang="ts">
  interface UserPageProps {
    name: string 
  }

  let { name }: UserPageProps = $props();
</script>

<p>Hello {name}</p>
