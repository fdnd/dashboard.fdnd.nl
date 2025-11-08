<script>
  let {data} = $props();
</script>

<aside>
  <h2>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-alert-square-rounded"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
    <span>GitHub Rate Limit</span>
  </h2>
{#if data.error}
  <p style="color: red;">Error: {data.error}</p>
{:else}
  <ul>
    <li><strong>Limit:</strong> {data.limit} requests per hour</li>
    <li><strong>Remaining:</strong> {data.remaining}</li>
    <li><strong>Reset:</strong> {data.reset?.toLocaleString()}</li>
  </ul>
{/if}
</aside>

<style>
aside {
  border-radius:var(--radius);
  background:var(--accent-color-3);
  padding:.5rem .75rem;
  position:fixed;
  bottom:1rem;
  right:1rem;
  font-size: .7em;

  h2 {
    font-weight: normal;
    display:flex;
    align-items: center;
    gap:.25rem;
  }

  ul {
    padding:0;
    list-style: none;
  }
}
</style>