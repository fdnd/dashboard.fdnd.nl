<script>
  let {data} = $props();
</script>

<aside>
  <details>
    <summary>
      <h2>GitHub Rate Limit</h2>
    </summary>

    {#if data.error}
      <p style="color: red;">Error: {data.error}</p>
    {:else}
      <ul>
        <li><strong>Limit:</strong> {data.limit} requests per hour</li>
        <li><strong>Remaining:</strong> {data.remaining}</li>
        <li><strong>Reset:</strong> {data.reset?.toLocaleString()}</li>
      </ul>
    {/if}
  </details>
</aside>

<style>
aside {
  border-radius:var(--radius);
  padding:.5rem .75rem;
  position:fixed;
  bottom:1rem;
  right:1rem;
  font-size: .7em;

  details {
    summary {
      background-color: var(--accent-color-3);
      padding:.5rem 2rem .5rem .5rem;

      &::before {
        top:.5rem;
        right: .5rem;
        height: 1.25rem;
        width: 1.25rem;

        svg {
          stroke: 1px;
        }
      }
    }

    &[open]::details-content {
      padding:0 .5rem .5rem;
      background-color: var(--accent-color-3);
    }

    h2 {
      font-weight: normal;
      display:flex;
      align-items: center;
      font-size: 1.25em;
      gap:.25rem;
    }

    ul {
      padding:0;
      margin-top: 0;
      list-style: none;
    }
  }
}
</style>