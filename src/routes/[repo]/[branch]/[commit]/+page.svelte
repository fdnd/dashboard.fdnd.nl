<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let { data } = $props()
  let { repo, branch, sha, details } = data
</script>

<section class="simple-text">
  <header>
    <Breadcrumb items={[
      { label: 'Dashboard', href: '/' },
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
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
      <span>bekijk op GitHub</span>
      <ExternalLink size={12} />
    </a>

  {:else}
    <p>Commit details unavailable (possibly deleted or invalid)</p>
  {/if}
</section>