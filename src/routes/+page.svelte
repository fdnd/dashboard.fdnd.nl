<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let { data } = $props()
  let { org, repos } = data
</script>



<section class="simple-text">
  <header>
    <Breadcrumb items={[{ label: 'Repositories' }]} />

    <h2>{org}</h2>
  </header>
  
  <p>
    This is a list with repositories of active projects on 
    <a href="https://github.com/fdnd-agency/" target="_blank" rel="noopener noreferrer">
      FDND Agency
      <ExternalLink size={12} />
    </a>
  </p>

  <ul>
    {#each repos as repo}
      <li>
        <a href={`/${repo.name}`}>{repo.name}</a> 
      </li>
    {/each}
  </ul>
</section>

<style>
  ul {
    display:flex;
    gap:.5rem;
    align-items:start;
    flex-wrap: wrap;
    max-width:80%;

    li {
      border: 1px solid currentColor;
      border-radius: var(--small-radius);
      display:flex;
      overflow: hidden;

      a {
        padding:.5rem;
        text-decoration:none;
        background-color: var(--green);
      }

      a:hover {
        background-color: var(--purple);
      }

    }
    
    
  }
</style>