
<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let {data} = $props();
  let { org, repo, branches = [], teamMembers = [], totalCommits = {}} = data;

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
    <h3>Total Commits</h3>
    <ul class="members">
    {#each Object.entries(totalCommits) as [login, count]}
      <li>
        <img src={memberMap[login]?.avatar_url} width="32" height="32" alt={login} class="avatar" />
        <strong>{login}</strong>
        <span>{count} commits</span>
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

</section>


<style>
  .simple-grid {
    display:grid;
    gap:4rem;

    header {
      grid-column: 1 / -1;
    }

    section:last-of-type {
      display:flex;
      flex-direction:column;

      h3 {
        margin-bottom: 1rem;
      }

      @media (min-width: 40rem) {
        max-width:75%;
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

    article {
      margin-bottom: 1rem;
    }

    @media (min-width: 40rem) {
      grid-template-columns: max-content auto;
    }
  }

  ul.members {
    display:flex;
    flex-direction:column;
    gap:.25rem;
    

    li {
      display:flex;
      align-items:center;
      gap:.25rem;
    }
  }

  
</style>