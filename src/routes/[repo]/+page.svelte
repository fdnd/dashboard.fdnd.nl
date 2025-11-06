
<script>
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let {data} = $props();
  let { org, repo, branches = [], teamMembers = [], totalCommits = {} } = data;

  const memberMap = {};
  teamMembers.forEach(m => memberMap[m.login] = m);
</script>

<section class="simple-text simple-grid">
  <header>
    <a href="/">← Back to active repos</a>
    <h2>{repo}</h2>
  </header>
  

  <!-- Total commits per member -->
  <section class="totals">
    <h3>Total Commits</h3>
    <ul class="members">
      {#each Object.entries(totalCommits).sort((a,b)=>b[1]-a[1]) as [login, count]}
        <li>
          <img src={memberMap[login]?.avatar_url} width="32" height="32" alt={login} class="avatar" />
          <strong>{login}</strong>: {count} commits
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h3>Branches</h3>
  <!-- Branch list -->
  {#if branches.length === 0}
    <p>No branches or team members found.</p>
  {:else}
    {#each branches as branch}
      <article class="branch">
        <h4>
          <a href={`/${repo}/${branch.name}`}>{branch.name}</a>
          <a href="{`https://github.com/fdnd-agency/${repo}/${branch}`}" target="_blank" rel="noopener noreferrer">
            <ExternalLink size=16 />
          </a>
        </h4>
        <ul class="members">
          {#each Object.entries(branch.memberCommitCounts).sort((a,b)=>b[1]-a[1]) as [login, count]}
            <li>
              <img src={memberMap[login]?.avatar_url} width="32" height="32" alt={login} class="avatar" />
              <strong>{login}</strong>: {count} commits
            </li>
          {/each}
        </ul>
      </article>
    {/each}
  {/if}
  </section>

</section>


<style>
  .simple-grid {
    display:grid;
    gap:4rem;

    header {
      grid-column:1 / -1;
    }

    @media (min-width: 30rem) {
      grid-template-columns: max-content auto;
    }
  }
</style>