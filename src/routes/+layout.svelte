<script>
	import favicon from '$lib/assets/favi.png'
	import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
	import RateLimit from '$lib/components/RateLimit.svelte'
	import LastUpdated from '$lib/components/LastUpdated.svelte'
	import { browser } from '$app/environment'

	let { children, data } = $props()
	// zoom animation step 1: store the UI state in a Svelte component.
	let projectScale = $state(1)
	let scrollAnimationEnabled = $state(true)

	function setProjectScale(nextScale) {
		const direction = nextScale > projectScale ? 'in' : 'out'
		document.documentElement.dataset.zoomDirection = direction

		const updateZoomLevel = () => {
			projectScale = nextScale
			document.documentElement.style.setProperty('--project-scale', String(nextScale))
		}

		// zoom animation step 3: respect prefers-reduced-motion.
		const prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches

		// zoom animation step 4: trigger the state update with the View Transition API.
		if (browser && document.startViewTransition && !prefersReducedMotion) {
			document.startViewTransition(updateZoomLevel)
		} else {
			// zoom animation step 5: apply the update directly if the View Transition API isn't supported or if the user prefers reduced motion.
			updateZoomLevel()
		}
	}

	function changeProjectScale(amount) {
		
		const nextScale = Math.min(1, Math.max(0.1, projectScale + amount))

		if (nextScale !== projectScale) {
			setProjectScale(nextScale)
		}
	}

	function toggleScrollAnimation() {
		scrollAnimationEnabled = !scrollAnimationEnabled
		document.documentElement.classList.toggle(
			'scroll-animation-disabled',
			!scrollAnimationEnabled
		)
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header />

<form class="zoom-controls">
	<!-- zoom animation step 2: trigger the state change from user interaction. -->
	<button
		type="button"
		aria-label="Zoom out"
		title="Zoom out"
		disabled={projectScale <= 0.1}
		onclick={() => changeProjectScale(-0.1)}
	>
		−
	</button>
	<span aria-live="polite">{Math.round(projectScale * 100)}%</span>
	<button
		type="button"
		aria-label="Zoom in"
		title="Zoom in"
		disabled={projectScale >= 1}
		onclick={() => changeProjectScale(0.1)}
	>
		+
	</button>
	<button
		type="button"
		aria-label={scrollAnimationEnabled ? 'Disable card animations' : 'Enable card animations'}
		title={scrollAnimationEnabled ? 'Disable card animations' : 'Enable card animations'}
		aria-pressed={scrollAnimationEnabled}
		onclick={toggleScrollAnimation}
	>
		{scrollAnimationEnabled ? '◌' : '○'}
	</button>
</form>

<main>
	<LastUpdated latestDeployAt={data.latestDeployAt} />
	
	{@render children()}

	<RateLimit { data } />
</main>

<Footer />

<style>
	.zoom-controls {
		position: fixed;
		top: 1rem;
		right: 2rem;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: .5rem;
		padding: .25rem;
		background: var(--accent-color-1);
		border-radius: var(--small-radius);
		color: var();
	}

	button {
		width: 2rem;
		height: 2rem;
		border: 1px solid currentColor;
		border-radius: var(--small-radius);
		background: transparent;
		color: inherit;
		font-size: 1.25rem;
		line-height: 1;
		cursor: pointer;
		text-align: center;
	}

	button:disabled {
		opacity: .4;
		cursor: not-allowed;
	}

	span {
		width: 2.5rem;
		text-align: center;
	}

	/* zoom animation step 7: style the View Transition pseudo-elements. */
	:global(html[data-zoom-direction='in']::view-transition-group(active-projects)),
	:global(html[data-zoom-direction='in']::view-transition-group(inactive-projects)),
	:global(html[data-zoom-direction='out']::view-transition-group(active-projects)),
	:global(html[data-zoom-direction='out']::view-transition-group(inactive-projects)) {
		animation-duration: 700ms;
		animation-timing-function: cubic-bezier(0.2, 2.4, 0.3, 1);
	}
</style>
