<script>
	import { navigating } from '$app/stores'
	import favicon from '$lib/assets/favi.png'
	import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
	import RateLimit from '$lib/components/RateLimit.svelte'

	let { children, data } = $props()

	// local state
  let nav = $state(null)
  let showLoader = $state(false)

  let timeoutId = null

  // keep `nav` in sync with the navigating store
  $effect(() => {
    const unsubscribe = navigating.subscribe((value) => {
      nav = value
    })

    return () => {
      unsubscribe()
    }
  })

  // show loader if navigation lasts longer than 250ms
  $effect(() => {
    const isNavigating = !!nav

    if (isNavigating) {
      // start a delay timer
      timeoutId = setTimeout(() => {
        showLoader = true
      }, 500)
    } else {
      // navigation finished: hide loader immediately
      showLoader = false
    }

    // cleanup: clear any pending timer when nav changes or component is destroyed
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }
  })
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header />

<main>
	{@render children()}

	<RateLimit {data} />
</main>

<Footer />

{#if showLoader}
  <div class="page-loader">
    <div class="spinner" />
    <span>Loading…</span>
  </div>
{/if}

<style>
  .page-loader {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: rgba(0, 0, 0, 0.35);
    color: white;
    z-index: 9999;
    backdrop-filter: blur(2px);
  }

  .spinner {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: white;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
