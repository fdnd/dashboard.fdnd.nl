<script>
  import RepoCard from '$lib/components/RepoCard.svelte'
  import YearFilter from '$lib/components/YearFilter.svelte'
  import { browser } from '$app/environment'

  let { title, id, repos = [], status } = $props()

  let selectedYear = $state('all')
  let expandedRepo = $state(null)

  const filteredRepos = $derived(
    selectedYear === 'all'
      ? repos
      : repos.filter((repo) =>
          repo.metadata?.years?.includes(Number(selectedYear))
        )
  )

  // Mark JS-enabled for CSS (so :target can be disabled when JS runs)
  if (browser) {
    document.documentElement.classList.add('js')
  }

  $effect(() => {
    if (!browser) return

    const updateExpanded = () => {
      const hash = window.location.hash.slice(1)

      if (hash && repos.find((repo) => repo.name === hash)) {
        const update = () => {
          expandedRepo = hash
        }

        if (document.startViewTransition) {
          document.startViewTransition(update)
        } else {
          update()
        }

        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      } else {
        // No valid hash → collapse all cards
        expandedRepo = null
      }
    }

    // Handle initial hash on page load
    updateExpanded()

    // Handle real hashchange events (e.g. manual hash edits)
    window.addEventListener('hashchange', updateExpanded)

    return () => window.removeEventListener('hashchange', updateExpanded)
  })

  function toggle(repoName) {
    const update = () => {
      expandedRepo = expandedRepo === repoName ? null : repoName
    }

    const syncHash = () => {
      if (!browser) return

      const base = window.location.pathname + window.location.search
      const href =
        expandedRepo === repoName ? `${base}#${repoName}` : base

      // Overwrite current history entry instead of adding a new one
      history.replaceState(history.state, '', href)
    }

    if (document.startViewTransition) {
      const transition = document.startViewTransition(update)

      transition?.finished.then(() => {
        const el = document.getElementById(repoName)
        if (el) {
          const offset = 6 * 16
          const top =
            el.getBoundingClientRect().top + window.scrollY - offset

          window.scrollTo({ top, behavior: 'smooth' })
        }

        syncHash()
      })
    } else {
      update()

      const el = document.getElementById(repoName)
      if (el) {
        const offset = 6 * 16
        const top =
          el.getBoundingClientRect().top + window.scrollY - offset

        window.scrollTo({ top, behavior: 'smooth' })
      }

      syncHash()
    }
  }
</script>

<section id={id}>
  <header>
    <h2>{title}</h2>

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
        grid-auto-rows: minmax(fit-content, auto);
        gap: 1rem;
        align-items: start;

        grid-auto-flow: row dense;
      }

      @media (min-width: 80rem) {
        grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
      }
    }
  }

  ::view-transition-group(*) {
    animation-duration: 300ms;
    animation-timing-function: ease;
  }
</style>