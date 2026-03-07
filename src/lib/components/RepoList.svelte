<script>
  import ExternalLink from '$lib/components/icons/ExternalLink.svelte'
  import RepoCard from '$lib/components/RepoCard.svelte'
  import YearFilter from '$lib/components/YearFilter.svelte'

  let {
    title,
    id,
    repos = [],
    status
  } = $props()

  // filter state
  let selectedYear = $state('all')

  // filtered repo list
  const filteredRepos = $derived(
    selectedYear === 'all'
      ? repos
      : repos.filter(
          repo =>
            repo.metadata?.years?.includes(Number(selectedYear))
        )
  )  
</script>

<section id={id}>
  <header>
    <h2>
      {title}
    </h2>

    <YearFilter
      bind:selectedYear
    />
  </header>

  {#each filteredRepos as repo (repo.name)}
    <RepoCard {repo} {status} />
  {/each}
</section>

<style>
  section {
    display:flex;
    flex-direction: column;
    gap:2rem;
    max-width: var(--max-width);
    margin: 0 -1rem 3rem;

    > header {
      grid-column: 1 / -1;
      margin:0 1rem;
      display: flex;
      flex-direction:row;
      justify-content: space-between;
      align-items:end;
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