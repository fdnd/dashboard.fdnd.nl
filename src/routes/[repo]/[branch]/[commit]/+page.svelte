<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let { data } = $props()
  let { repo, branch, sha, details } = data
</script>

<section class="simple-text">
  <header>
    <Breadcrumb items={[
      { label: 'Repositories', href: '/' },
      { label: repo, href: `/${repo}` },
      { label: branch, href: `/${repo}/${branch}` },
      { label: sha.slice(0, 7) }
    ]} />
   
    <h2>
      Commit: {sha.slice(0, 7)}
      <a href={`https://github.com/fdnd-agency/${repo}/commit/${sha}`} target="_blank" rel="noopener noreferrer">
        <span class="sr-only">Bekijk op GitHub</span>
        <ExternalLink size={12} />
      </a>
    </h2>
  </header>
  
  {#if details}
    <ul>
      <li><strong>Author:</strong> {details.author}</li>
      <li><strong>Date:</strong> {new Date(details.date).toLocaleString()}</li>
      <li><strong>Message:</strong> {details.message}</li>
      <li>
        <strong>Stats:</strong> {details.stats.total} total changes
        (+{details.stats.additions} / -{details.stats.deletions})
      </li>
    </ul>

    <h3>Changed Files</h3>
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
      <ExternalLink size={12} />
    </a>

  {:else}
    <p>Commit details unavailable (possibly deleted or invalid)</p>
  {/if}
</section>