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

  // which repo is expanded
  let expandedRepo = $state(null)

  function toggle(repoName) {
    const update = () => {
      expandedRepo = expandedRepo === repoName ? null : repoName
    }

    if (document.startViewTransition) {
      document.startViewTransition(update)
    } else {
      update()
    }
  }

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

    <YearFilter bind:selectedYear />
  </header>

  <div>
    {#each filteredRepos as repo (repo.name)}
      <RepoCard
        {repo}
        {status}
        expanded={expandedRepo === repo.name}
        onToggle={() => toggle(repo.name)}
      />
    {/each}
  </div>
  
</section>

<style>
  section {
    max-width: var(--max-width);
    margin: 0 -1rem 3rem;

    > header {
      margin: 0 1rem 1rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: end;
    }

    div {
      display: flex;
      flex-direction: column;
      gap: 2rem;

      @media (min-width: 60rem) {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
        grid-auto-rows: minmax(18rem, auto); /* ensures row height can grow */
        gap: 1rem;
        align-items: start;
        grid-auto-flow: row dense;
      }

      @media (min-width: 80rem) {
        grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
      }
    }
  }

  /* smoother view transition timing */
  ::view-transition-group(*) {
    animation-duration: 300ms;
    animation-timing-function: ease;
  }
</style>