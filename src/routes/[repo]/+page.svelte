
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
      { label: 'Repositories', href: '/' },
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
            <h4>
              {branch.name}
            </h4>
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
              <li><a href={`/${repo}/${branch.name}`}>meer informatie</a></li>
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
          gap:.5rem;
          margin:0;



          li:first-child::after {
            content: " |";

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