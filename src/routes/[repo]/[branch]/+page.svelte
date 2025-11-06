<script>
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let { data } = $props()
  let { repo, branch, commits } = data

  $inspect(commits)
</script>

<section class="simple-text">
  <h2>{repo} </h2>
  <p>Branch: {branch}</p>

  <ul>
    {#each commits as c}
    <li>
      <a href={`/${repo}/${branch}/${c.sha}`}>
        <img src="{c.avatar_url}" width="24" height="24" alt="{c.author}" class="avatar"><strong>{c.author}</strong> <code>{c.sha.slice(0,7)}</code> <em>{c.message}</em>
      </a>
      <a href="{`https://github.com/fdnd-agency/${repo}/${branch}/${c.sha}`}" target="_blank" rel="noopener noreferrer">
        <ExternalLink size=16 />
      </a>
    </li>
  {/each}
  </ul>
</section>

<style>
  ul {
    display:flex;
    flex-direction: column;
    gap:.5rem;
  }

  li {
    display:flex;
    gap:.5rem;
    align-items:start;
  }

  a {
    display:flex;
    flex-wrap: wrap;
    gap:.5rem;
    align-items:center;

    @media (min-width:30rem) {
      display:grid;
      grid-template-columns: 24px  minmax(0, 1fr) max-content auto;
      
    }
  }
</style>
