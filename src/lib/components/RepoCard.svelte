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

        <li class="status {status}">
          <span>{status === 'active' ? '🔥' : '🧊'}</span>
          <span class="sr-only">{status}</span>
        </li>
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
      <ul>
        <li>
          <a href={`/${repo.name}`}>
            Repository details
          </a>
        </li>
        <li>
          <a href={`https://github.com/fdnd-agency/${repo.name}`}>
            <ExternalLink size={16} />
            Show on GitHub
          </a>
        </li>
      </ul>
    </footer>
  {/if}
</article>

<style>
  article {
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
      background-color: var(--accent-color-2);
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

        .status {
          --_fill: #b6e9da;
          background-color:var(--_fill);
        }

        .inactive {
          --_fill: #d3c1ef;
        }

      
      }
    }

    h4{
      margin-bottom: .5rem;
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
      background-color: #d3c1ef;
      margin:auto -1rem -1rem;
      padding:.5rem 1rem;
      border-radius: 0 0 var(--small-radius) var(--small-radius);
      border-top:1px solid currentColor;
      display:flex;
      justify-content: end;

      ul {
        margin:0;
        flex-direction: row;
        gap: 1rem;
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