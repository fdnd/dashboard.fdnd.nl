<script>
  let {data} = $props();
</script>

<aside>
  <h2 class="sr-only">GitHub Rate Limit</h2>
{#if data.error}
  <p style="color: red;">Error: {data.error}</p>
{:else}
  <ul>
    <li><strong>Rate Limit:</strong> {data.limit} requests per hour</li>
    <li><strong>Remaining:</strong> {data.remaining}</li>
    <li><strong>Reset:</strong> {data.reset?.toLocaleString()}</li>
  </ul>
{/if}
</aside>

<style>
aside {
  border-radius:var(--radius);
  background:var(--green);
  padding:.5rem;
  position:fixed;
  bottom:1rem;
  right:1rem;
  font-size: .8em;

  h2 {
    font-weight: normal;
  }

  ul {
    padding:0;
    list-style: none;
  }
}
</style>