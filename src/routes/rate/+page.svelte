<script>
 let {data} = $props();
</script>

<main>
  <h1>GitHub API Rate Limit</h1>

  {#if data.error}
    <p style="color: red;">Error: {data.error}</p>
  {:else}
    <ul>
      <li><strong>Limit:</strong> {data.limit} requests per hour</li>
      <li><strong>Remaining:</strong> {data.remaining}</li>
      <li><strong>Reset:</strong> {data.reset?.toLocaleString()}</li>
    </ul>
  {/if}
</main>

<style>
main {
  max-width: 600px;
  margin: 2rem auto;
  font-family: system-ui, sans-serif;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 0.5rem 0;
}
strong {
  font-weight: 600;
}
</style>
