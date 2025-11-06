<script>
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let { data } = $props()
  let { org, repos } = data
</script>

<section class="simple-text">
  <h2>{org}</h2>
  <p>Active repositories (with an active team)</p>
  <ul>
    {#each repos as repo}
      <li>
        <a href={`/${repo.name}`}>{repo.name}</a> 
        <a href="{`https://github.com/fdnd-agency/${repo.name}`}" target="_blank" rel="noopener noreferrer">
          <ExternalLink size=16 />
        </a>
      </li>
    {/each}
  </ul>
</section>

