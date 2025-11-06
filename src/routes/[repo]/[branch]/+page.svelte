<script>
  let { data } = $props()
  let { repo, branch, commits } = data

  $inspect(commits)
</script>

<main>
  <h1>{repo} / {branch}</h1>

  <ul>
    {#each commits as c}
    <li>
      <!-- full SHA must go in the URL -->
      <a href={`/${repo}/${branch}/${c.sha}`}>
        <img src="{c.avatar_url}" width="24" height="24" alt="{c.author}"><strong>{c.author}</strong> <code>{c.sha.slice(0,7)}</code> <em>{c.message}</em>
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