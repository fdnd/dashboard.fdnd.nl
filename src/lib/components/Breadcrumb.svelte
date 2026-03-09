<script>
  import Git from "./icons/Git.svelte"
  let { items = [] } = $props()
</script>

<nav>
  <ol class="breadcrumbs">
    {#each items as item, index (item.label)}
      <li class="breadcrumb-item">
        {#if index === 0}
          <Git />
        {/if}

        {#if item.href}
          <a href={item.href}>{item.label}</a>
        {:else}
          <span>{item.label}</span>
        {/if}

        <!-- Separator, skip after last item -->
        {#if index < items.length - 1}
          <span class="sep">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-arrow-narrow-right">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M5 12l14 0" />
              <path d="M15 16l4 -4" />
              <path d="M15 8l4 4" />
            </svg>
          </span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style>

  ol {
    display:flex;
    flex-wrap:wrap;
    padding:0 0 .5rem;

    li {
      display:flex;
      gap:.25rem;
      flex-wrap:nowrap;
      align-items:center;

      * {
        text-wrap:nowrap;
      }

      a {
        margin:-.25rem;
      }
      
      a::first-letter, span::first-letter {
        text-transform: capitalize;
      }

      span.sep {
        padding:0 .25rem 0 0;
      }             
    }
  }
  
</style>

