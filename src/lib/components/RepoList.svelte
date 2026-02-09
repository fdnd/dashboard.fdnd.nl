<script>
  import ExternalLink from '$lib/components/icons/ExternalLink.svelte'
  import RepoCard from '$lib/components/RepoCard.svelte'

  const {
    title,
    id,
    repos = [],
    status
  } = $props()
</script>

<section id="{id}">
  <header>
    <h2>
      {title}
      <a
        href="https://github.com/fdnd-agency/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Show on GitHub
        <ExternalLink size={12} />
      </a>
    </h2>
  </header>

  {#each repos as repo (repo.name)}
    <RepoCard {repo} {status} />
  {/each}
</section>

<style>
  section {
    display:flex;
    flex-direction: column;
    gap:1rem;
    max-width: var(--max-width);
    margin: 0 -1rem 1rem;

    > header {
      grid-column: 1 / -1;
      margin:0 1rem;
    }

    @media (min-width: 60rem) {
      display:grid;
      grid-template-columns: 1fr 1fr;
      place-items:stretch;
    }

    @media (min-width: 80rem) {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
</style>
