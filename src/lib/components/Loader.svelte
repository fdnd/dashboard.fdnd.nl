<script>
	import { navigating } from '$app/stores'

	const isNavigating = $derived(navigating)
</script>

{#if isNavigating}
	<div class="loader" aria-live="polite" aria-busy="true">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-github"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" /></svg>
		<span>Loading repository data from the GitHub API, this may take a while.</span>
	</div>
{/if}

<style>
	.loader {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		overflow: hidden;

    svg {
      animation: loading .25s cubic-bezier(0, 1.21, 1, .22) infinite both;
    }
	}

	@keyframes loading {
		0% {
			scale: 1;
		}
		100% {
			scale: 1.1;
		}
	}
</style>