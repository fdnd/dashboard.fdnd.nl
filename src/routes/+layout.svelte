<script>
	import favicon from '$lib/assets/favi.png'
	import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
	import RateLimit from '$lib/components/RateLimit.svelte'
	import LastUpdated from '$lib/components/LastUpdated.svelte'

	let { children, data } = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header />

<main>
	<LastUpdated latestDeployAt={data.latestDeployAt} />
	
	{@render children()}

	<RateLimit { data } />
</main>

<Footer />
