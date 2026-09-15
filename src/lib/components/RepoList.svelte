<script>
  import RepoCard from '$lib/components/RepoCard.svelte'
  import { browser } from '$app/environment'
  import { replaceState } from '$app/navigation'

  let { title, id, repos = [] } = $props()

  let expandedRepo = $state(null)

  const sortedRepos = $derived(
    [...repos].sort((a, b) => {
      const titleA = a.metadata?.title ?? a.name
      const titleB = b.metadata?.title ?? b.name

      return titleA.localeCompare(titleB, undefined, { sensitivity: 'base' })
    })
  )

  function getCardId(repo) {
    return repo.cardId ?? repo.name
  }

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
    const targetRepo = repos.find((repo) => getCardId(repo) === hash)

    if (targetRepo) {
        runViewTransition(
          () => {
            expandedRepo = targetRepo.name
          },
          'expand'
        )

      const el = document.getElementById(getCardId(targetRepo))
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
  function handleTargetedRepo(repoName, cardId) {
    const direction = expandedRepo === repoName ? 'collapse' : 'expand'
    const transition = runViewTransition(
      () => toggleExpansion(repoName),
      direction
    )

    if (transition) {
      transition.finished.then(() => {
        scrollToTarget(cardId)
        syncTargetHash(repoName, cardId)
      })
    } else {
      scrollToTarget(cardId)
      syncTargetHash(repoName, cardId)
    }

  }

  // Keeps the URL hash in sync with the targeted repository.
  function syncTargetHash(repoName, cardId) {
    if (!browser) return

    const base = window.location.pathname + window.location.search
    const href = expandedRepo === repoName ? `${base}#${cardId}` : base

    // Overwrite current history entry instead of adding a new one
    replaceState(href, history.state)
  }

  // Scrolls the page to the targeted repository card.
  function scrollToTarget(cardId) {
    const el = document.getElementById(cardId)
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
  </header>

  <div>
    {#each sortedRepos as repo (repo.name)}
      <RepoCard
        {repo}
        expanded={expandedRepo === repo.name}
        cardId={getCardId(repo)}
        onToggle={() => handleTargetedRepo(repo.name, getCardId(repo))}
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

  :global(:root[data-transition-direction='expand']::view-transition-group(.repo-card)) {
    animation-duration: 300ms;
    animation-timing-function: ease-out;
  }

  :global(:root[data-transition-direction='collapse']::view-transition-group(.repo-card)) {
    animation-duration: 300ms;
    animation-timing-function: ease-in;
  }
</style>