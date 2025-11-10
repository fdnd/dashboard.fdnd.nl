
<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let {data} = $props();
  let { org, repo, branches = [], teamMembers = [], totalCommits = {}, openPRs, closedPRs, pullRequestsByMember } = data;

  const memberMap = {};
  teamMembers.forEach(member => memberMap[member.login] = member);

  console.log(repo)
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
        <span class="sr-only">Show on GitHub</span>
        <ExternalLink size={12} />
      </a>
    </h2>
  </header>
  
  <section class="totals" id="total-commits">
    <h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-git-commit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M12 3l0 6" /><path d="M12 15l0 6" /></svg> Total Commits</h3>

    <ul class="members">
      {#each Object.entries(totalCommits).sort((a,b)=>b[1]-a[1]) as [login, count]}
        <li>
          <img src={memberMap[login].avatar_url} width="32" height="32" alt={login} class="avatar" />
          <strong>{login}</strong> 
          <small>{count} commits</small>
          <!-- PRs: {pullRequestStats[login]?.open ?? 0} open / {pullRequestStats[login]?.closed ?? 0} closed -->
          <!-- Issues totals & section -->
        </li>
      {/each}
    </ul>
  </section>

  <section id="branches">
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
                  <img src={memberMap[login].avatar_url} width="32" height="32" alt={login} class="avatar" />
                  <strong>{login}</strong>: {count} commits
                </li>
              {/each}
            </ul>

            <ul class="more-info">
              <li>
                <a href={`/${repo}/${branch.name}`}>
                  <span>show branch</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                </a>
              </li>
              <li>
                <a href={`https://fdnd-agency/${repo}/tree/${branch.name}`}>
                  
                  <span>show on GitHub</span>
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

  {#if pullRequestsByMember}
  <section id="pull-requests">
    <h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-git-pull-request"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M6 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M18 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M6 8l0 8" /><path d="M11 6h5a2 2 0 0 1 2 2v8" /><path d="M14 9l-3 -3l3 -3" /></svg> Pull Requests</h3>

    {#each Object.entries(pullRequestsByMember) as [login, prs]}
      <article>
        <h4>
          <img src={memberMap[login].avatar_url} width="32" height="32" alt={login} class="avatar" />
          <span>{login}</span>
        </h4>
        {#if prs.open.length > 0}
          <h5>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-git-pull-request-draft"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M6 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M18 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M6 8v8" /><path d="M18 11h.01" /><path d="M18 6h.01" /></svg> 
            <span>Open <small>{prs.open.length}</small></span> 
          </h5>
          <ul>
            {#each prs.open as pr}
              <li>
                <a href={pr.html_url} target="_blank" rel="noopener noreferrer">
                  <code>
                    <small class="label nr">#{pr.number}</small>
                    {pr.title}
                  </code>
                </a>
              </li>
            {/each}
          </ul>
        {/if}

        {#if prs.closed.length > 0}
          <h5>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-git-pull-request-closed"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M6 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M18 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M6 8v8" /><path d="M18 11v5" /><path d="M16 4l4 4m0 -4l-4 4" /></svg>
            <span>Closed <small>{prs.closed.length}</small></span>
          </h5>
          <ul>
            {#each prs.closed as pr}
              <li>
                <a href={pr.html_url} target="_blank" rel="noopener noreferrer">
                  <code>
                    <small class="label nr">#{pr.number}</small>
                    {pr.title}
                    {#if pr.merged_at}
                      <small class="label merged">merged</small>
                    {/if}
                  </code>
                </a>
              </li>
            {/each}
          </ul>
        {/if}
      </article>
    {/each}
  </section>
  {/if}


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

        ul {
          margin:0;
        }

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
    article {
      margin-bottom: 1rem;
    }

    @media (min-width: 40rem) {
      grid-template-columns: 1fr 1fr;

      section#total-commits {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
      }

      section#branches {
        grid-column: 1 / 2;
        grid-row: 3 / 4;
      }

      section#pull-requests {
        grid-column: 2 / 3;
        grid-row: 3 / 4;

        h5, ul {
          margin-left: 2.25rem;
        }

        ul {
          margin-bottom: 1rem;
        }
      }
    }

    @media (min-width: 60rem) {
      grid-template-columns: 1fr 2fr 3fr;

      section#total-commits {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
      }

      section#branches {
        grid-column: 2 / 3;
        grid-row: 2 / 3;
      }

      section#pull-requests {
        grid-column: 3 / 4;
        grid-row: 2 / 3;
      }
    }
  }

  ul:not(.more-info) {
    display:flex;
    flex-direction:column;
    gap:.5rem;
    margin:0;
    
    li {
      display:flex;
      align-items:end;
      gap:.25rem;

      img {
        margin-right: .25rem;
      }

      a {
        display:flex;
        align-items:start;
        gap:.25rem 0;
        text-decoration: none;
        line-height:1.4;
        
        

        &:hover {
          text-decoration: underline;
        }

        .label {
          font-size: .75rem;
          --_bgcolor: var(--darkgrey);
          background: var(--_bgcolor);
          border-radius:.25rem;
          padding:0 .25rem;
        }
      }

      small {
        white-space: nowrap;
        line-height:1.6;
      }
    }
  }

  h4, h5 {
    display:flex;
    gap:.25rem;
    margin-bottom: .5rem;
    align-items:end;
  }

  h5 {
    align-items: center;

    small {
      align-self:start;
      opacity:.6;
    }
  }


  
</style>