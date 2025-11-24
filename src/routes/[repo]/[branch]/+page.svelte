<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import ExternalLinkIcon from '$lib/components/icons/ExternalLink.svelte'
  import ViewIcon from '$lib/components/icons/View.svelte'
  import BranchesIcon from '$lib/components/icons/Branches.svelte';

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
      <BranchesIcon /> {branch}
      <a href={`https://github.com/fdnd-agency/${repo}/${branch}`} target="_blank" rel="noopener noreferrer">
        <span>Show on GitHub</span>
        <ExternalLinkIcon size={12} />
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
                <span>commit details</span>
              </code>
              <ViewIcon />
            </a>
            
          </td>
          <td class="more-info">
            <a href="{`https://github.com/fdnd-agency/${repo}/${branch}/${c.sha}`}" target="_blank" rel="noopener noreferrer">
              <code>show on GitHub</code>
              <ExternalLinkIcon size={12} />
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

  table {
    border:1px solid currentColor;
    border-radius:var(--radius);
    margin: 1rem 0;

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
}
</style>
