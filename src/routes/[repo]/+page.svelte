
<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let {data} = $props();
  let { org, repo, branches = [], teamMembers = [], totalCommits = {}, openPRs, closedPRs, mergedPRs, pullRequestStats } = data;

  const memberMap = {};
  teamMembers.forEach(m => memberMap[m.login] = m);
</script>

<section class="simple-text simple-grid">
  
  <header>
    <Breadcrumb items={[
      { label: 'Dashboard', href: '/' },
      { label: repo }
    ]} />

    <h2>
      {repo}
      <a href={`https://github.com/fdnd-agency/${repo}/`} target="_blank" rel="noopener noreferrer">
        <span class="sr-only">Bekijk op GitHub</span>
        <ExternalLink size={12} />
      </a>
    </h2>
  </header>
  

  <!-- Total commits per member -->
  <section class="totals">
    <h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-git-commit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M12 3l0 6" /><path d="M12 15l0 6" /></svg> Total Commits</h3>

    <ul class="members">
      {#each Object.entries(totalCommits).sort((a,b)=>b[1]-a[1]) as [login, count]}
        <li>
          <img src={memberMap[login]?.avatar_url} width="32" height="32" alt={login} class="avatar" />
          <strong>{login}</strong>: 
          {count} commits 
          <!-- PRs: {pullRequestStats[login]?.open ?? 0} open / {pullRequestStats[login]?.closed ?? 0} closed -->
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-git-branch"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 8l0 8" /><path d="M9 18h6a2 2 0 0 0 2 -2v-5" /><path d="M14 14l3 -3l3 3" /></svg> Branches</h3>

    {#if branches.length === 0}
      <p>No branches or team members found.</p>
    {:else}
    {#each branches as branch}
      <article class="branch">
        <details>
          <summary>
            <code>
              {branch.name}
            </code>
          </summary>

          <div class="body">
            <ul class="members">
              {#each Object.entries(branch.memberCommitCounts).sort((a,b)=>b[1]-a[1]) as [login, count]}
                <li>
                  <img src={memberMap[login]?.avatar_url} width="32" height="32" alt={login} class="avatar" />
                  <strong>{login}</strong>: {count} commits
                </li>
              {/each}
            </ul>

            <ul class="more-info">
              <li>
                <a href={`/${repo}/${branch.name}`}>
                  <span>bekijk branch</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                </a>
              </li>
              <li>
                <a href={`https://fdnd-agency/${repo}/tree/${branch.name}`}>
                  
                  <span>bekijk op GitHub</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>

           
          </div>
        </details>
      </article>
    {/each}
  {/if}
  </section>

  <section>
    <h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-git-pull-request"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M6 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M18 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M6 8l0 8" /><path d="M11 6h5a2 2 0 0 1 2 2v8" /><path d="M14 9l-3 -3l3 -3" /></svg> Pull Requests</h3>

    <h4>Open PR's</h4>
    <ul>
      {#each openPRs as pr}
        <li>
          <a href={pr.html_url} target="_blank" rel="noopener noreferrer">
            #{pr.number} / {pr.title} by {pr.user}
          </a>
        </li>
      {/each}
    </ul>

    <h4>Closed PR's</h4>
    <ul>
      {#each closedPRs as pr}
        <li>
          <a href={pr.html_url} target="_blank" rel="noopener noreferrer">
            {pr.title}
          </a>
          <small class="label nr">#{pr.number}</small>
          <small class="label author">{pr.user}</small>
          {#if pr.merged_at}
            <small class="label merged">merged</small>
          {/if}
        </li>
      {/each}
    </ul>
  </section>

</section>


<style>
  .simple-grid {
    display:grid;
    gap:2rem;

    header {
      grid-column: 1 / -1;
    }

    section {
      display:flex;
      flex-direction:column;
      grid-column: 2 / -1;

      h3 {
        margin-bottom: 1rem;
      }

      div.body {
        padding:1rem;
        display:flex;
        flex-direction:column;

        .more-info {
          display:flex;
          align-self:end;
          gap:1rem;
          margin:0;

          a {
            display:flex;
            align-items: center;
            gap:.25rem;
          }
        }
      }
    }

    section:first-of-type {
      grid-column: 1 / 2;
    }

    article {
      margin-bottom: 1rem;
    }

    @media (min-width: 40rem) {
      grid-template-columns: auto 1fr;
    }
  }

  ul:not(.more-info) {
    display:flex;
    flex-direction:column;
    gap:.5rem;
    

    li {
      display:flex;
      align-items:center;
      gap:.25rem;
    }
  }

  .label {
    font-size: .75rem;
    --_bgcolor: var(--green);
    background: var(--_bgcolor);
    border-radius:.25rem;
    padding:0 .25rem;
  }

  .author {
    --_bgcolor:var(--purple);
  }

  .merged {
    --_bgcolor:var(--yellow);
  }


  
</style>