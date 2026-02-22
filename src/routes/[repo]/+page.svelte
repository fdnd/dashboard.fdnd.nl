
<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import ExternalLinkIcon from '$lib/components/icons/ExternalLink.svelte'
  import BranchesIcon from '$lib/components/icons/Branches.svelte'
  import ViewIcon from '$lib/components/icons/View.svelte'
  import PullRequestIcon from '$lib/components/icons/PullRequest.svelte'
  import CommitsIcon from '$lib/components/icons/Commits.svelte'
  import OpenPRsIcon from '$lib/components/icons/OpenPRs.svelte'
  import ClosedPRsIcon from '$lib/components/icons/ClosedPRs.svelte'

  
  let {data} = $props()
  let { org, repo, branches = [], teamMembers = [], totalCommits = {}, openPRs, closedPRs, pullRequestsByMember } = data

  const memberMap = {}
  teamMembers.forEach(member => memberMap[member.login] = member)
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
        <span>Show on GitHub</span>
        <ExternalLinkIcon size={12} />
      </a>
    </h2>
  </header>
  
  <section class="totals" id="total-commits">
    <h3>
      Total Commits
      <CommitsIcon />
    </h3>

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
    <h3>
      Branches
      <BranchesIcon />
    </h3>

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
                  <span>branch details</span>
                  <ViewIcon />
                </a>
              </li>
              <li>
                <a href={`https://fdnd-agency/${repo}/tree/${branch.name}`}>
                  
                  <span>show on GitHub</span>
                  <ExternalLinkIcon size={12} />
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
    <h3>
      Pull Requests
      <PullRequestIcon />
    </h3>

    {#each Object.entries(pullRequestsByMember) as [login, prs]}
      <article>
        <h4>
          <img src={memberMap[login].avatar_url} width="32" height="32" alt={login} class="avatar" />
          <span>{login}</span>
        </h4>
        {#if prs.open.length > 0}
          <h5>
            <OpenPRsIcon />
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
            <ClosedPRsIcon />
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
        display:flex;
        align-items:center;
        gap:1rem;
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