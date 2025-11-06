<script>
  let { data } = $props()
  let { repo, sha, details } = data
</script>

<main>
  <a href={`/${repo}`}>← Back to {repo}</a>
  <h1>Commit {sha.slice(0, 7)}</h1>

  <section>
    <p><strong>Author:</strong> {details.author}</p>
    <p><strong>Date:</strong> {new Date(details.date).toLocaleString()}</p>
    <p><strong>Message:</strong> {details.message}</p>
    <p>
      <strong>Stats:</strong> {details.stats.total} total changes
      (+{details.stats.additions} / -{details.stats.deletions})
    </p>
  </section>

  <h2>Changed Files</h2>
  <ul>
    {#each details.files as file}
      <li>
        <code>{file.filename}</code> — +{file.additions} / -{file.deletions} ({file.changes} changes)
      </li>
    {/each}
  </ul>
</main>
