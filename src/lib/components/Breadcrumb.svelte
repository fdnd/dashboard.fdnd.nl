<script>
  let { items = [] } = $props()
</script>

<nav>
  <ol class="breadcrumbs">
    {#each items as item, index (item.label)}
      <li class="breadcrumb-item">
        {#if index === 0}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-dashboard"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 13m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M13.45 11.55l2.05 -2.05" /><path d="M6.4 20a9 9 0 1 1 11.2 0z" /></svg>
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

      * {
        text-wrap:nowrap;
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

