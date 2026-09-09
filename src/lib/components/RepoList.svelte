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

  if (browser) {
    document.documentElement.classList.add('js')
  }

  $effect(() => {
    // Handle initial hash on page load
    expandTargetFromHash()

    // Handle real hashchange events (e.g. manual hash edits)
    window.addEventListener('hashchange', expandTargetFromHash)

    return () => window.removeEventListener('hashchange', expandTargetFromHash)
  })


  // Expands the repository referenced by the current URL hash.
  function expandTargetFromHash() {
    const hash = window.location.hash.slice(1)

    if (hash && repos.find((repo) => repo.name === hash)) {
        runViewTransition(
          () => {
            expandedRepo = hash
          },
          'expand'
        )

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

  // Handles expanding, scrolling to, and linking the targeted repository
  function handleTargetedRepo(repoName) {
    const direction = expandedRepo === repoName ? 'collapse' : 'expand'
    const transition = runViewTransition(
      () => toggleExpansion(repoName),
      direction
    )

    if (transition) {
      transition.finished.then(() => {
        scrollToTarget(repoName)
        syncTargetHash(repoName)
      })
    } else {
      scrollToTarget(repoName)
      syncTargetHash(repoName)
    }

  }

  // Keeps the URL hash in sync with the targeted repository.
  function syncTargetHash(repoName) {
    if (!browser) return

    const base = window.location.pathname + window.location.search
    const href = expandedRepo === repoName ? `${base}#${repoName}` : base

    // Overwrite current history entry instead of adding a new one
    history.replaceState(history.state, '', href)
  }

  // Scrolls the page to the targeted repository card.
  function scrollToTarget(repoName) {
    const el = document.getElementById(repoName)
    if (!el) return

    const offset = 6 * 16
    const top = el.getBoundingClientRect().top + window.scrollY - offset

    window.scrollTo({ top, behavior: 'smooth' })
  }

  // Expands a repository or collapses it when it is already open.
  function toggleExpansion(repoName) {
    expandedRepo = expandedRepo === repoName ? null : repoName
  }

  // Runs a state update with a view transition when supported.
  function runViewTransition(update, direction) {
    document.documentElement.dataset.transitionDirection = direction

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (document.startViewTransition && !prefersReducedMotion) {
      return document.startViewTransition(update)
    }

    update()
    return null
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
        onToggle={() => handleTargetedRepo(repo.name)}
      />
    {/each}
  </div>
</section>

<style>
  section {
    max-width: var(--max-width);
    margin: 0 -1rem 3rem;

    transform: scale(var(--project-scale, 1));
    rotate: calc(var(--project-scale, 1) - 1) * -5deg;
    transform-origin: center top;

    /* zoom animation step 6: identify the elements that should transition. */
    &#active-projects {
      view-transition-name: active-projects;
    }

    &#inactive-projects {
      view-transition-name: inactive-projects;
    }

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

  :root[data-transition-direction='expand']::view-transition-group(*) {
    animation-duration: 300ms;
    animation-timing-function: ease-out;
  }

  :root[data-transition-direction='collapse']::view-transition-group(*) {
    animation-duration: 300ms;
    animation-timing-function: ease-in;
  }
</style>