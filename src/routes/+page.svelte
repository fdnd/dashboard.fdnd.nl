<script>
  let { data } = $props()

  let { org, repos } = data
</script>

<main>
  <h1>{org}</h1>
  <p>Active repositories (with an active team)</p>
  <ul>
    {#each repos as repo}
      <li>
        <a href={`/${repo.name}`}>{repo.name}</a>
      </li>
    {/each}
  </ul>
</main>
