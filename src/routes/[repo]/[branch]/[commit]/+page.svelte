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
      {sha.slice(0, 7)}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-git-commit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M12 3l0 6" /><path d="M12 15l0 6" /></svg> 

      <a href={`https://github.com/fdnd-agency/${repo}/commit/${sha}`} target="_blank" rel="noopener noreferrer">
        <span>Show on GitHub</span>
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
    

  {:else}
    <p>Commit details unavailable (possibly deleted or invalid)</p>
  {/if}
</section>