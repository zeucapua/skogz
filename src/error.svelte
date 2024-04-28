<script lang="ts">
  import "./app.css";
  let count = 1;
</script>

<main>
  <img src="/Never Gonna Give You Up.gif" alt="Never Gonna Give You Up" />
  <h1>RICKROLL</h1>
  <p>You just got rickrolled</p>
  <div>
    <button on:click={() => count++}>Count: {count}</button>
    <a href="/">Root?</a>
  </div>
</main>

<style>
  button {
    color: orange;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 2em;
  }
</style>
