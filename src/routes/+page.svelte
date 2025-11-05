<script>
  let { data } = $props()

  let { org, repos } = data
</script>

<main>
  <h1>{org}</h1>
  <p>Active Repositories (with a team)</p>
  <ul>
    {#each repos as repo}
      <li>
        <a href={`/${repo.name}`}>{repo.name}</a>
      </li>
    {/each}
  </ul>
</main>

<style>
main {
  max-width: 900px;
  margin: 2rem auto;
  font-family: system-ui, sans-serif;
}
a {
  color: #0366d6;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
ul {
  list-style: none;
  padding: 0;
}
ul li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.25rem 0;
}
</style>