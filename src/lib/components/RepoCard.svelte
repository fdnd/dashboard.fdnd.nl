<script>
  import ExternalLink from '$lib/components/icons/ExternalLink.svelte'
  import View from '$lib/components/icons/View.svelte'
  import Hide from '$lib/components/icons/Hide.svelte';
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

  <div class="details">
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

    <div class="activity">
      <div>
        {#if repo.metadata?.team && repo.metadata.team.length}
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
        {/if}

        {#if !browser}
          <a class="collapse" href="#all-projects">Hide activity</a>
        {/if}
      </div>
    </div>
  </div>

  {#if hasMeta}
    <footer>
      {#if repo.epics?.length > 0}
        <button command="show-modal" commandfor="backlog-{repo.name}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-checkup-list"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"
            />
            <path
              d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2"
            />
            <path d="M9 14h.01" />
            <path d="M9 17h.01" />
            <path d="M12 16l1 1l3 -3" />
          </svg>
          <span>epics</span>
        </button>
      {/if}

      <!-- Progressive enhancement:
           - No JS: href="#repo.name" navigates and :target expands via CSS
           - JS: onclick prevents navigation and just calls onToggle()
      -->
      {#if repo.metadata?.team && repo.metadata.team.length}
      <a
        href="#{repo.name}"
        onclick={(e) => {
          e.preventDefault()
          onToggle()
        }}
      >
        team year 1
        {#if expanded}
          <Hide size={12} />
        {:else}
          <View size={12} />
        {/if}
      </a>
      {/if}

      <ul>
        <li>
          <a href={`/${repo.name}`}>
            details<View size={12} />
          </a>
        </li>
        <li>
          <a href={`https://github.com/fdnd-agency/${repo.name}`}>
            github repo<ExternalLink size={12} />
          </a>
        </li>
      </ul>

      {#if repo.epics?.length > 0}
        <dialog id="backlog-{repo.name}">
          <h4>
            <em>{hasMeta ? repo.metadata.title : repo.name}</em>
            <span>Epics</span>
          </h4>
          <ul>
            {#each repo.epics as epic}
              <li><a href="{epic.url}">{epic.title}</a></li>
            {/each}
          </ul>
          <button commandfor="backlog-{repo.name}" command="close">
            close
          </button>
        </dialog>
      {/if}
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

    .details {
      display:grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap:1rem;
      align-items: start;
      margin-bottom: 0;
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

        &.activity {
          margin: 1rem -1rem 0;
          grid-column: 1 / -1;
          position: relative;
          display:flex;
          gap:1rem;
          flex-direction: column;
          align-items:center;
          overflow-x:auto;
          padding-bottom:1rem;

          div {
            display: none;
            flex-direction:column;

            img {
              max-width: 100%;
              border-radius: .5rem;
            }

            .collapse {
              align-self:end;
              margin-top: .5rem;
            }
          }
        }

        h4{
          margin-bottom: .5rem;
        }

        span {
          white-space: nowrap;
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

    button {
      --_background: #e3e3e3;
      align-self:start;
      padding:.25rem .5rem;
      border: 1px solid var(--blue);
      background:var(--_background);
      display:flex;
      gap:.25rem;
      align-self:center;
      align-items:center;
      cursor: pointer;

      &:hover,
      &:focus-visible {
        --_background: var(--green);
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
        }
      }

      :modal {
        display:grid;
        place-self: center;
        border-radius:var(--small-radius);
        z-index:100;
        border-width:1px; 

        height: auto;
        max-height: max-content;
        min-height: unset;

        h4 {
          margin-bottom: .5rem;
          display:flex;
          flex-direction:column;

          em {
            font-style: normal;
            font-size: 1.25rem;
          }
        }

        ul {
          flex-direction: column;
          margin-bottom: 1rem;
          margin-left: 0;
        }

        button {
          justify-self: end;
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

  /* No JS: :target → expanded layout + show activity content */
  :global(html:not(.js) article:target) {
    @media (min-width: 60rem) {
      grid-column: span 2;
      grid-row: span 2;
      z-index: 5;
      scroll-margin-top: 4rem;
    }
  }

  :global(html:not(.js) article:target div.details > div.activity > div) {
    display:flex;
  }

  /* JS: .expanded → same behaviour; :target is ignored in JS mode */
  :global(html.js article.expanded div.details > div.activity > div) {
    display:flex;
  }
</style>