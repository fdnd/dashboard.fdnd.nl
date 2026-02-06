<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import ExternalLink from '$lib/components/icons/ExternalLink.svelte'
  let { data } = $props()
  let { org, repos } = data
</script>

<section class="simple-text">
  <header>
    <Breadcrumb items={[{ label: 'Dashboard', home:true }]} />
    <h2>
      FDND Agency Projects
      <a href="https://github.com/fdnd-agency/" target="_blank" rel="noopener noreferrer">
       Show on GitHub
        <ExternalLink size={12} />
      </a>
    </h2>
  </header>
  
  {#each repos as repo}
  
    <article class={repo.metadata?.status}>
      <header>
        <div>
          <h3>
            {#if repo.metadata && Object.keys(repo.metadata).length > 0}
              <span>{repo.metadata.title}</span>
            {:else}
              <span>{repo.name}</span>
            {/if}
          </h3>

          <ul>
            {#each repo.metadata.years as year}
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-school"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" /><path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" /></svg>
                <span>jaar {year}</span>
              </li>
            {/each}

            <li class="status {repo.metadata.status}">
              {#if repo.metadata.status == 'active'}
                <span>🔥</span>
                <span>actief</span>
              {:else}
                  <span>🧊</span>
                  <span>inactief</span>
              {/if}
            </li>
          </ul>
        </div>
        
        {#if repo.metadata && Object.keys(repo.metadata).length > 0}
          <p>{repo.metadata?.client}</p>
        {/if}

        
      </header>

      <div class="details">
        {#if repo.team?.members && repo.team.members.length > 0}
        <div>
          <h4>Team</h4>
          <ul>
            {#each repo.team.members as member}
              <li>
                <img width="24" height="24" src="{member.avatar_url}" class="avatar" alt="{member.login}">
                <span>{member.login}</span>
              </li>
            {/each}
          </ul>
        </div>
        {/if}

        {#if repo.metadata && Object.keys(repo.metadata).length > 0}
        <div>
          <h4>Live sites</h4>
          <ul>
            <li>
              <a href="{repo.metadata.main_link}">
                <code>main</code>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="{repo.metadata.dev_link}">
                <code>dev</code>
                <ExternalLink size={12} />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Tech stack</h4>
          <ul>
            {#each repo.metadata.tech_stack as item}
              <li><code><a href="/">{item}</a></code></li>
            {/each}
          </ul>
        </div>
        {/if}
      </div>

      {#if repo.metadata && Object.keys(repo.metadata).length > 0}
      <footer>
        <ul>
          <li>
            <a href={`/${repo.name}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
              
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
    
  {/each}
</section>


<style>
  section {
    display:flex;
    flex-direction: column;
    gap:2rem;
    max-width: var(--max-width);
    margin: 0 auto 1rem;
    padding: var(--padding-side) var(--padding-side) 0 calc(var(--padding-side) * 2);

    > header {
      grid-column: 1 / -1;
      padding:0 1rem;
    }

    @media (min-width: 60rem) {
      display:grid;
      grid-template-columns: 1fr 1fr;
      place-items:stretch;
    }

    @media (min-width: 80rem) {
      grid-template-columns: 1fr 1fr 1fr;
    }

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
        background-color: var(--accent-color-1);
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
  }
</style>