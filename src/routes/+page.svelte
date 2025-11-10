<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let { data } = $props()
  let { org, repos } = data
</script>

<section class="simple-text">
  <header>
    <Breadcrumb items={[{ label: 'Dashboard', home:true }]} />
    <h2>FDND Agency</h2>
  </header>
  
  <p>
    This is a list of active projects on 
    <a href="https://github.com/fdnd-agency/" target="_blank" rel="noopener noreferrer">
      FDND Agency
      <ExternalLink size={12} />
    </a>
  </p>

 
  {#each repos as repo}
  <a href={`/${repo.name}`}>
    <article>
      <header>
        <h3>
        {#if repo.metadata && Object.keys(repo.metadata).length > 0}
          {repo.metadata.title}
        {:else}
          {repo.name}
        {/if}
        </h3>
      </header>
      

      <!-- <p>
        {repo.description}
      </p> -->

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
        <h4>Live links</h4>
        <ul>
          <li>{repo.metadata.main_link}</li>
          <li>{repo.metadata.dev_link}</li>
        </ul>
      </div>

      <footer>
        <h4 class="sr-only">Tech stack</h4>
        <ul class="tech-stack">
          {#each repo.metadata.tech_stack as item}
            <li>{item}</li>
          {/each}
          
        </ul>
      </footer>
      {/if}
      </article>
    </a>
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
  
    > a {
      text-decoration:none;
      border-radius: var(--radius);
      background-color: var(--accent-color-2);
      transition:.25s;

      &:hover {
        background-color: var(--accent-color-1);
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
        
          &::first-letter {
            text-transform: capitalize;
          }
        }

        h4, h5 {
          margin-bottom: 0;
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
            padding:.25rem;
            border-radius:.5rem;
            background-color: rgb(255,255,255,.25);
          }
          
        }
      } 
    }
  }
  
</style>