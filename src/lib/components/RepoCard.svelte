<script>
  import ExternalLink from '$lib/components/icons/ExternalLink.svelte'
  import View from '$lib/components/icons/View.svelte'
  import Arrow from '$lib/components/icons/Arrow.svelte'
  import { browser } from '$app/environment'

  const { repo, status, expanded = false, onToggle } = $props()

  const hasMeta = $derived(
    !!repo.metadata && Object.keys(repo.metadata).length > 0
  )

  const SPRINTS = {
    8: { month: 3, day: 2, slug:'server-side-rendering-server-side-website', name:'Server-Side Website' },
    9: { month: 3, day: 16, slug:'the-web-is-for-everyone-interactive-functionality', name:'The Web is for Everyone' },
    10: { month: 4, day: 13, slug:'user-experience-enhanced-website', name:'User Experience' },
    11: { month: 5, day: 11, slug:'pleasurable-ui', name:'Pleasurable UI' }
  }

  function isReleased(sprintNumber) {
    const YEAR = 2026
    const now = new Date()

    const config = SPRINTS[sprintNumber]
    const date = new Date(YEAR, config.month - 1, config.day)
    return now.getTime() >= date.getTime()
  }

  function getSprintUrl(member, sprintNumber) {
    const config = SPRINTS[sprintNumber]
    return `https://github.com/${member.github}/${config.slug}`
  }

  function getSprintName(sprintNumber) {
    return SPRINTS[sprintNumber].name
  }
</script>

<article
  id={repo.name}
  class="{status} {expanded ? 'expanded' : ''}"
  style="view-transition-name: repo-{repo.name}"
>
  <header>
    <div>
      <h3><span>{hasMeta ? repo.metadata.title : repo.name}</span></h3>

      <ul>
        {#each repo.metadata?.years ?? [] as year}
          <li><span>year {year}</span></li>
        {/each}
      </ul>
    </div>

    {#if hasMeta}
      <p>{repo.metadata.client}</p>
    {/if}
  </header>

  <div class="body">
    {#if repo.team?.members?.length}
      <div>
        <h4>Team year 2</h4>
        <ul>
          {#each repo.team.members as member (member.login)}
            <li>
              <img
                width="24"
                height="24"
                src={member.avatar_url}
                alt={member.login}
                class="avatar"
              />
              <a href="https://github.com/{member.login}" target="_blank" rel="noreferrer">{member.login}</a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if hasMeta}
      <div>
        <h4>Live sites</h4>
        <ul>
          <li>
            <a href={repo.metadata.main_link}>
              <code>main</code><ExternalLink size={12} />
            </a>
          </li>
          <li>
            <a href={repo.metadata.dev_link}>
              <code>dev</code><ExternalLink size={12} />
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h4>Tech stack</h4>
        <ul>
          {#each repo.metadata.tech_stack as tech}
            <li><code>{tech}</code></li>
          {/each}
        </ul>
      </div>
    {/if}

    <div class="details">
        <div>
          <h4>Scope</h4>

          <ul>
            <li>
              <a href="https://github.com/fdnd-agency/{repo.name}/wiki/Design-Challenge" target="_blank" rel="noreferrer">
                Design challenge
              </a>
            </li>
          </ul>

        </div>
        
        <div>
          <h4>Project board(s)</h4>

          <ul>
            {#each repo.project_boards as projectboard}
              <li>
                <a href={projectboard.url} target="_blank" rel="noreferrer">
                  {projectboard.title}
                </a>
              </li>
            {/each}
            </ul>
        </div>

        {#if repo.epics?.length > 0}
        <div class="epics">
          <h4>Epics</h4>

          <ul>
            {#each repo.epics as epic}
              <li><a href="{epic.url}">{epic.title}</a></li>
            {/each}
          </ul>
        </div>
          
        {/if}

        {#if repo.metadata?.team && repo.metadata.team.length}
        <div class="team-year-1">
          <table>
            <thead>
              <tr>
                <th>Team year 1</th>
                {#each [8, 9, 10, 11] as sprint}
                  <th>Sprint {sprint}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each repo.metadata.team as member}
                <tr>
                  <td>
                    <a href="https://github.com/{member.github}" target="_blank" rel="noreferrer">{member.name} @{member.github}</a>
                  </td>

                  {#each [8, 9, 10, 11] as sprint}
                    <td>
                      {#if isReleased(sprint)}
                        <a
                          href={getSprintUrl(member, sprint)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {getSprintName(sprint)} 
                        </a>
                      {:else}
                        {getSprintName(sprint)}
                      {/if}
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        {/if}

        {#if !browser}
          <a class="collapse" href="#all-projects">Hide details</a>
        {/if}
      </div>
  </div>

  {#if hasMeta}
    <footer>

      <ul>
        <li>          
          <a
            href="#{repo.name}"
            onclick={(e) => {
              e.preventDefault()
              onToggle()
            }}
          >
            {#if expanded}
              Hide details
            {:else}
              Show details
            {/if}
            
            <Arrow { expanded } />
          </a>
        </li>
        <li>
          <a href={`/${repo.name}`}>
            Activity
            <View size={12} />
          </a>
        </li>
        <li>
          <a href={`https://github.com/fdnd-agency/${repo.name}`} target="_blank" rel="noreferrer">
            GitHub repo
            <ExternalLink size={16} />
          </a>
        </li>
      </ul>
    </footer>
  {/if}
</article>

<style>
  article {
    --_fill: var(--accent-color-2);
    display:flex;
    flex-direction: column;
    justify-content:start;
    gap:.5rem;
    border: 1px solid currentColor;
    border-radius: var(--small-radius);
    display:flex;
    padding:1rem;
    min-height:100%;
    background:#fff;
    margin:0 .5rem;
    font-size: .9rem;

    @media (min-width:30rem) {
      margin:0;
    }

    &.expanded {
      @media (min-width: 60rem) {
        grid-column: span 2;
        grid-row: span 2;
        z-index: 5;
        scroll-margin-top: 4rem;
      }
    }

    header {
      background-color: var(--_fill);
      margin:-1rem -1rem 1rem;
      padding:.5rem 1rem;
      border-radius: var(--small-radius) var(--small-radius) 0 0;
      border-bottom:1px solid currentColor;
      
      div {
        display:flex;
        justify-content: space-between;
        align-items: start;
        position:relative;
      }
      
      h3 {
        width:fit-content; 
        margin-top: .5rem;
        
        &::first-letter {
          text-transform: capitalize;
        }
      }

      p {
        margin-bottom: .5rem;
        text-wrap: balance;
      }

      ul {
        position:absolute;
        right:0;
        top:.5rem;
        display:flex;
        flex-direction: row;
        align-items:center;

        li {
          display: inherit;
          align-items: inherit;
          white-space: nowrap;
          border:1px solid currentColor;
          border-radius:.5rem;
          padding:0 .5rem;
          background-color: var(--grey);
        }
      }
    }

    &.inactive header {
      --_fill: #e3e3e3;
    }

    .body {
      display:grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap:1rem;
      align-items: start;
      margin-bottom: 1rem;
      margin-top:1rem;

      div {
        border-left:1px solid #ccc;
        padding:0 1rem;
        margin: 0 calc(-1rem - .5px);

        &:first-child {
          border-left:none;
          margin:0;
          padding-left:0;
          align-self:stretch;
        }

        &:last-child {
          border:none;
          margin:0;
        }

        &.details {
          margin: 0 -1rem;
          grid-column: 1 / -1;
          position: relative;
          display:flex;
          gap:1rem;
          flex-direction: column;
          align-items:center;
          position: relative;
          padding-top:1rem;
          display: none;
          grid-template-columns: subgrid;
          gap: 1rem;
          align-items: start;
            

            a {
              padding:0;
              display:flex;
              align-items: center;
              gap:.25rem;
            }

            div {
              border-left:1px solid #ccc;
              margin: 0 calc(-1rem - .5px);

              &:first-child {
                border-left:none;
                padding:0;
                margin-left:0;
                align-self:stretch;
              }

              &.epics {
                grid-column: 1 / -1;

                @media (min-width:30rem) {
                  grid-column:auto;
                }
              }

              &.team-year-1 {
                border:none;
                margin:0;
                grid-column: 1 / -1;
                overflow-x: auto;
                margin: 0 -1rem;
                padding: 0 1rem;
                width: calc(100% + 2rem);
              }

              a {
                margin-left:0rem;
              }
            }



            .collapse {
              align-self:end;
              margin-top: .5rem;
            }
          
        }

        h4{
          margin-bottom: .5rem;
        }

        ul {
          margin-bottom: 0;
        }

        code {
          font-family: inherit;
        }
      }
    }

    ul {
      display:flex;
      flex-direction: column;
      gap:.5rem;
      margin:0 0 1rem;
      
      li {
        display:flex;
        gap:.25rem;

        a {
          display:flex;
          align-items:center;
          gap:.25rem;
          margin: -.25rem;
        }
      }
    }

    footer {
      background-color: transparent;
      margin:auto -1rem -1rem;
      padding:.5rem 1rem;
      border-radius: 0 0 var(--small-radius) var(--small-radius);
      border-top:1px solid currentColor;
      display:flex;
      gap:.25rem;
      align-items: center;
      min-height: 3.25rem;

      ul {
        margin:0 0 0 auto;
        flex-direction: row;
        flex-wrap:wrap;
        gap: .5rem;
        justify-content:end;

        @media (min-width: 60rem) {
          flex-direction:row;
          gap: 1rem;
        }
      }

      a {
        text-decoration: none;
        display: flex;
        gap:.25rem;
        align-items: center;
        text-decoration:underline;
        white-space: nowrap;
        
        &:hover, &:focus-visible {
          text-decoration:none;
        }
      }
    }
  }

  /* --- Progressive enhancement glue ---
     No JS: :target expands the card
     JS: .expanded (Svelte state) expands the card
  */

  /* No JS: :target → expanded layout + show details content */
  :global(html:not(.js) article:target) {
    @media (min-width: 60rem) {
      grid-column: span 2;
      grid-row: span 2;
      z-index: 5;
      scroll-margin-top: 4rem;
    }
  }

  :global(html:not(.js) article:target div.details),
  :global(html.js article.expanded div.details) {
    display:grid;
  }
</style>