<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let { data } = $props()
  let { org, repos } = data
</script>

<section class="simple-text">
  <header>
    <Breadcrumb items={[{ label: 'Dashboard', home:true }]} />
    <h2>FDND Agency Projects</h2>
    <p>
      This is a list of active projects on 
      <a href="https://github.com/fdnd-agency/" target="_blank" rel="noopener noreferrer">
        FDND Agency
        <ExternalLink size={12} />
      </a>
    </p>
  </header>
  
  {#each repos as repo}
  
    <article>
      <header>
        <h3>
        {#if repo.metadata && Object.keys(repo.metadata).length > 0}
          <span>{repo.metadata.title}</span>
        {:else}
          <span>{repo.name}</span>
        {/if}
        </h3>
      </header>
      
      
      <!-- <p>
        {repo.description}
      </p> -->

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
        {/if}
      </div>

      {#if repo.metadata && Object.keys(repo.metadata).length > 0}
      <footer>
        <div class="meta">
          <h4 class="sr-only">Tech stack</h4>
          <ul class="tech-stack">
            {#each repo.metadata.tech_stack as item}
              <li>{item}</li>
            {/each}
          </ul>
        </div>
        

        <a href={`/${repo.name}`}>
          Show repository
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
        </a>
      </footer>
      {/if}
      </article>
    
  {/each}
</section>


<style>
  section {
    display:flex;
    flex-direction: column;
    gap:1rem;

    header, p {
      grid-column: 1 / -1;
    }

    @media (min-width: 40rem) {
      display:grid;
      grid-template-columns: 1fr 1fr;
      place-items:stretch;
    }

    @media (min-width: 60rem) {
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

      h3 {
        font-weight:normal;
        background-color: var(--accent-color-2);
        margin:-1rem -1rem 1rem;
        padding:.5rem 1rem;
        border-radius: var(--small-radius) var(--small-radius) 0 0;
        border-bottom:1px solid currentColor;
      
        &::first-letter {
          text-transform: capitalize;
        }
      }

      h4{
        margin-bottom: 0;
      }

      div.details {
        display:grid;
        grid-template-columns: 2fr 1fr;
        gap:1rem;
        margin-bottom: 1rem;

        div:last-of-type {
          border-left:1px solid var(--blue-20);
          padding-left:1rem;
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
        }
      }

      ul.tech-stack {
        margin-top: auto;
        margin-bottom: 0;
        font-size: .8em;
        flex-direction: row;

        li {
          border:1px solid var(--blue);
          padding:0 .25rem;
          border-radius:.5rem;
          background-color: rgb(255,255,255,.25);
          font-size:.9rem;
        }
      }

      footer {
        background-color: var(--accent-color-1);
        margin:auto -1rem -1rem;
        padding:.5rem 1rem;
        border-radius: 0 0 var(--small-radius) var(--small-radius);
        border-top:1px solid currentColor;
        display:flex;
        justify-content: space-between;

        a {
          font-size: .9rem;
          display: flex;
          gap:.25rem;
          align-items: center;
        }
      }

      
        
      


      
      
    } 
  }
  
  
</style>