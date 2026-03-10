<script>
  import RepoCard from '$lib/components/RepoCard.svelte'
  import YearFilter from '$lib/components/YearFilter.svelte'
  import { browser } from '$app/environment' 
  // SvelteKit utility that is true only in the browser.
  // During SSR this is false.

  let { title, id, repos = [], status } = $props()
  // $props() is a Svelte 5 rune that exposes component props.
  // Parent components pass these values into RepoList.

  let selectedYear = $state('all')
  // $state() creates reactive local state.
  // When it changes, Svelte updates the DOM automatically.

  let expandedRepo = $state(null)
  // Stores the repo currently expanded in the UI.
  // Only one repo can be expanded at a time.

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

  const filteredRepos = $derived(
    selectedYear === 'all'
      ? repos
      : repos.filter(repo =>
          repo.metadata?.years?.includes(Number(selectedYear))
        )
  )
  // $derived() creates reactive computed state.
  // Whenever selectedYear or repos change, this recomputes automatically.
  // The UI then updates accordingly.

  $effect(() => {
    if (!browser) return
    // Prevents running browser-only code during SSR.

    const updateExpanded = () => {

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

    updateExpanded()
    // Run once when the component mounts.

    window.addEventListener('hashchange', updateExpanded)
    // React to manual URL changes or browser navigation.

    return () =>
      window.removeEventListener('hashchange', updateExpanded)
    // Cleanup when the component is destroyed.
  })
</script>


<section id={id}>
  <!-- Section wrapper allows linking to the whole repo group -->

  <header>
    <h2>{title}</h2>

    <YearFilter bind:selectedYear />
    <!-- Two-way binding.
         Changes inside YearFilter update selectedYear here. -->
  </header>

  <div>
    {#each filteredRepos as repo (repo.name)}
      <!-- Keyed each block.
           repo.name ensures stable identity during updates.
           Important for layout transitions and performance. -->

      <RepoCard
        {repo}
        {status}
        expanded={expandedRepo === repo.name}
        onToggle={() => toggle(repo.name)}
      />
      <!-- Passes state and event handler down to the card component. -->
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
      /* Header layout: title left, filter right */
    }

    div {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      /* Mobile layout: stacked cards */

      @media (min-width: 60rem) {

        display: grid;

        grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
        /* Responsive grid that fills available space */

        grid-auto-rows: minmax(18rem, auto);
        /* Ensures consistent minimum card height */

        gap: 1rem;

        align-items: start;

        grid-auto-flow: row dense;
        /* Allows cards that span multiple rows/columns
           to back-fill empty grid gaps */
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
  /* Global timing for all View Transition animations.
     Applies to layout changes such as expanding cards
     or grid reshuffling. */
</style>