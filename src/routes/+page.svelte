<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let { data } = $props()
  let { org, repos } = data
</script>

<section class="simple-text">
  <header>
    <Breadcrumb items={[{ label: 'Dashboard', home:true }]} />
    <h2>{org}</h2>
  </header>
  
  <p>
    This is a list with Dashboard of active projects on 
    <a href="https://github.com/fdnd-agency/" target="_blank" rel="noopener noreferrer">
      FDND Agency
      <ExternalLink size={12} />
    </a>
  </p>

 
  {#each repos as repo}
  <a href={`/${repo.name}`}>
    <article>
      <h3>
      {#if repo.metadata && Object.keys(repo.metadata).length > 0}
        {repo.metadata.title}
      {:else}
        {repo.name}
      {/if}
      </h3>

      {#if repo.team?.members && repo.team.members.length > 0}
        <ul>
          {#each repo.team.members as member}
            <li>
              <img width="24" height="24" src="{member.avatar_url}" class="avatar" alt="{member.login}">
              <span>{member.login}</span>
            </li>
          {/each}
        </ul>
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
        height:100%;

        h3::first-letter {
          text-transform: capitalize;
        }

        ul {
          display:flex;
          flex-wrap:wrap;
          gap:.5rem;

          li {
            display:flex;
            gap:.25rem;
          }
        }      
      } 
    }
  }
  
</style>