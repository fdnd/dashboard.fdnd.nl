<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import ExternalLink from '$lib/icons/ExternalLink.svelte'
  let { data } = $props()
  let { repo, branch, commits } = data
</script>

<section class="simple-text">
  <header>
    <Breadcrumb items={[
      { label: 'Dashboard', href: '/' },
      { label: repo, href: `/${repo}` },
      { label: branch }
    ]} />

    <h2>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-git-branch"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 8l0 8" /><path d="M9 18h6a2 2 0 0 0 2 -2v-5" /><path d="M14 14l3 -3l3 3" /></svg> {branch}
      <a href={`https://github.com/fdnd-agency/${repo}/${branch}`} target="_blank" rel="noopener noreferrer">
        <span class="sr-only">Bekijk op GitHub</span>
        <ExternalLink size={12} />
      </a>
    </h2>
  </header>
  
  <div class="scroller">
    <table>
      <tbody>
        {#each commits as c}
        <tr> 
          <td><img src="{c.avatar_url}" width="24" height="24" alt="{c.author}" class="avatar"></td>
          <td><code>{c.author}</code></td>
          <td><code>{c.sha.slice(0,7)}</code></td>
          <td class="message"><code>{c.message}</code></td>
          <td class="more-info">
            <a href={`/${repo}/${branch}/${c.sha}`}>
              <code>
                <span>bekijk commit</span>
              </code>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
            </a>
            
          </td>
          <td class="more-info">
            <a href="{`https://github.com/fdnd-agency/${repo}/${branch}/${c.sha}`}" target="_blank" rel="noopener noreferrer">
              <code>open in GitHub</code>
              <ExternalLink size={12} />
            </a>
          </td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
  
</section>

<style>
.scroller {
  width:100%;
  overflow-x:auto;
}
table {
  border-collapse: collapse;

  tr:nth-of-type(even) {
    background-color: rgb(0,0,0,.025);
  }

  td {
    padding:.5rem;
    vertical-align: top;
  }

  td.message {
    min-width:40ch;
  }

  td.more-info {
    white-space: nowrap;

    a {
      display:flex;
      gap:.25rem;
      align-items: center;
    }
  }
}
</style>
