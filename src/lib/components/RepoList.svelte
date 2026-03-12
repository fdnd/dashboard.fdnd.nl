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
      : repos.filter(repo =>
          repo.metadata?.years?.includes(Number(selectedYear))
        )
  )

  $effect(() => {
    if (!browser) return
    
    updateExpanded()

    window.addEventListener('hashchange', updateExpanded)

    function updateExpanded () {

      const hash = window.location.hash.slice(1)
      // Extract repo name from URL fragment (#repo-name).

      if (hash && repos.find(repo => repo.name === hash)) {
        // If a matching repo exists, expand it.

        const update = () => expandedRepo = hash

        if (document.startViewTransition) {
          document.startViewTransition(update)
          // Animate expansion if supported.
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
        expandedRepo = null
        // No valid hash → collapse all cards.
      }
    }

    return () => window.removeEventListener('hashchange', updateExpanded)
  })

  function toggle(repoName) {

    const update = () => {
      // Toggle logic:
      // if this repo is already expanded → collapse
      // otherwise expand this repo
      expandedRepo = expandedRepo === repoName ? null : repoName
    }

    if (document.startViewTransition) {
      // View Transitions API
      // Animates layout changes between DOM states.

      const transition = document.startViewTransition(update)

      transition?.finished.then(() => {
        // Wait until the transition finishes before scrolling.
        // Prevents the grid from jumping mid-animation.

        const el = document.getElementById(repoName)

        if (el) {
          const offset = 6 * 16
          // Offset compensates for a sticky header (6rem).

          const top =
            el.getBoundingClientRect().top +
            window.scrollY -
            offset
          // Calculates the element's absolute position in the page.

          window.scrollTo({ top, behavior: 'smooth' })
          // Scrolls smoothly to the expanded card.
        }

        history.pushState(
          null,
          '',
          expandedRepo === repoName ? `#${repoName}` : ' '
        )
        // Updates the URL hash without triggering navigation.
        // Enables deep-linking to expanded cards.
      })

    } else {
      // Fallback for browsers without View Transition support.

      update()

      const el = document.getElementById(repoName)

      if (el) {
        const offset = 6 * 16
        const top =
          el.getBoundingClientRect().top +
          window.scrollY -
          offset

        window.scrollTo({ top, behavior: 'smooth' })
      }

      history.pushState(
        null,
        '',
        expandedRepo === repoName ? `#${repoName}` : ' '
      )
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