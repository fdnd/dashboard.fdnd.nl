<script>
  let { items = [] } = $props()
</script>

<nav class="breadcrumb">
  {#each items as item, i}
    {#if i > 0}
    <span class="sep">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M15 16l4 -4" /><path d="M15 8l4 4" /></svg>
    </span>
    {/if}
    {#if item.href}
      <a href={item.href}>{item.label}</a>
    {:else}
      <span>{item.label}</span>
    {/if}
  {/each}
</nav>

<style>
  a, span {
    text-transform: capitalize;
  }

  span.sep {
    padding:0 0 0 .5rem;
  }
</style>

