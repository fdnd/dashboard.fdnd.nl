
<script>
  let {data} = $props();
  let { org, repo, branches = [], teamMembers = [], totalCommits = {} } = data;

  const memberMap = {};
  teamMembers.forEach(m => memberMap[m.login] = m);
</script>

<main>
  <a href="/">← Back to Repos</a>
  <h1>{repo}</h1>

  <!-- Total commits per member -->
  <section class="totals">
    <h2>Total Commits</h2>
    <ul class="members">
      {#each Object.entries(totalCommits).sort((a,b)=>b[1]-a[1]) as [login, count]}
        <li>
          <img src={memberMap[login]?.avatar_url} width="32" height="32" alt={login} />
          <strong>{login}</strong>: {count} commits
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h2>Branches</h2>
  </section>
  <!-- Branch list -->
  {#if branches.length === 0}
    <p>No branches or team members found.</p>
  {:else}
    {#each branches as branch}
      <article class="branch">
        <h3>{branch.name}</h3>
        <ul class="members">
          {#each Object.entries(branch.memberCommitCounts).sort((a,b)=>b[1]-a[1]) as [login, count]}
            <li>
              <img src={memberMap[login]?.avatar_url} width="32" height="32" alt={login} />
              <strong>{login}</strong>: {count} commits
            </li>
          {/each}
        </ul>
      </article>
    {/each}
  {/if}
</main>

<style>
main {
  max-width: 900px;
  margin: 2rem auto;
  font-family: system-ui, sans-serif;
}
h1 {
  text-transform: uppercase;
}
h2 {
  font-weight: normal;
}
a {
  color: #0366d6;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
.totals {
  margin-bottom: 2rem;
}
.branch {
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
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
img {
  border-radius: 50%;
}
strong {
  font-weight: 600;
}
</style>
