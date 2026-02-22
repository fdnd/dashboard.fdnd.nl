<script>
  import ExternalLink from '$lib/components/icons/ExternalLink.svelte'

  const { repo, status } = $props()

  const hasMeta = $derived(
    !!repo.metadata && Object.keys(repo.metadata).length > 0
  )
</script>

<article class={status}>
  <header>
    <div>
      <h3>
        <span>
          {hasMeta ? repo.metadata.title : repo.name}
        </span>
      </h3>

      <ul>
        {#each repo.metadata?.years ?? [] as year}
          <li>
            <span>🎓 jaar {year}</span>
          </li>
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
        <h4>Team</h4>
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
              <span>{member.login}</span>
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
              <code>main</code>
              <ExternalLink size={12} />
            </a>
          </li>
          <li>
            <a href={repo.metadata.dev_link}>
              <code>dev</code>
              <ExternalLink size={12} />
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h4>Tech stack</h4>
        <ul>
          {#each repo.metadata.tech_stack as tech}
            <li>
              <code>{tech}</code>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>

  {#if hasMeta}
    <footer>
      {#if repo.epics?.length > 1}
      <button command="show-modal" commandfor="backlog-{repo.name}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-checkup-list"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" /><path d="M9 14h.01" /><path d="M9 17h.01" /><path d="M12 16l1 1l3 -3" /></svg>
        <span>epics</span>
      </button>
      {/if}   
      <ul>
        <li>
          <a href={`/${repo.name}`}>
            repository details
          </a>
        </li>
        <li>
          <a href={`https://github.com/fdnd-agency/${repo.name}`}>
            
            show on GitHub
            <ExternalLink size={16} />
          </a>
        </li>
      </ul>
      {#if repo.epics?.length > 1}
      <dialog id="backlog-{repo.name}">
        <h4><em>{hasMeta ? repo.metadata.title : repo.name}</em> <span>Epics</span></h4>

        <ul>
        {#each repo.epics as epic}
          <li>
            <a href="{epic.url}">{epic.title}</a>
          </li>
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
    background:#eee;

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
        bottom:-4.25rem;
        display:flex;
        flex-direction: row;
        align-items:center;
        font-size: .9rem;

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
      --_fill: #d3c1ef;
    }

    div.details {
      display:grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap:1rem;
      align-items: start;
      margin-bottom: 1rem;
      margin-top:1rem;

      div {
        border-right:1px solid var(--blue-20);
        padding-right:1rem;

        &:last-child {
          border:none;
          padding:0;
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
        }
      }
    }

    footer {
      background-color: #e3e3e3;
      margin:auto -1rem -1rem;
      padding:.5rem 1rem;
      border-radius: 0 0 var(--small-radius) var(--small-radius);
      border-top:1px solid currentColor;
      display:flex;

      ul {
        margin:0 0 0 auto;
        flex-direction: row;
        gap: 1rem;
      }

      button {
        --_background: transparent
        align-self:start;
        padding:.25rem .5rem;
        border: 1px solid var(--blue);
        background:var(--_background);
        display:flex;
        gap:.25rem;
        align-items:center;

        &:focus-visible {
          --_background: #a3ffe3;
        }
      }

      :modal {
        display:grid;
        place-self: center;
        border-radius:1rem;
        z-index:100;

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
        

        &:hover, &:focus-visible {
          text-decoration:none;
        }
      }
    }
  }
</style>