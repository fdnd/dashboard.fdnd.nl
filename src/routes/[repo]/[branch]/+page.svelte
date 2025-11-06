<script>
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let { data } = $props()
  let { repo, branch, commits } = data

  $inspect(commits)
</script>

<main>
  <h1>{repo} / {branch}</h1>

  <ul>
    {#each commits as c}
    <li>
      <a href={`/${repo}/${branch}/${c.sha}`}>
        <img src="{c.avatar_url}" width="24" height="24" alt="{c.author}"><strong>{c.author}</strong> <code>{c.sha.slice(0,7)}</code> <em>{c.message}</em>
      </a>
      <a href="{`https://github.com/fdnd-agency/${repo}/${branch}/${c.sha}`}" target="_blank" rel="noopener noreferrer">
        <ExternalLink size=16 />
      </a>
    </li>
  {/each}
  </ul>

</main>

<style>
  a {
    display:flex;
    gap: 1em;
  }

  img {
    aspect-ratio: 1;
    border-radius: 50%;
  }
</style>