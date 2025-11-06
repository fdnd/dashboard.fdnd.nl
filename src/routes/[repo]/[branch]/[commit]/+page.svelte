<script>
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let { data } = $props()
  let { repo, sha, details } = data
</script>

<section class="simple-text">
  <a href={`/${repo}`}>← Back to {repo}</a>

  {#if details}
    <h2>Commit {sha.slice(0, 7)}</h2>

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

    <!-- External GitHub commit link -->
    <a href={`https://github.com/fdnd-agency/${repo}/commit/${sha}`} target="_blank" rel="noopener noreferrer">
      <span>Bekijk op GitHub</span>
      <ExternalLink size={16} />
    </a>

  {:else}
    <p>Commit details unavailable (possibly deleted or invalid)</p>
  {/if}
</section>