<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import MainHeader from '$lib/components/MainHeader.svelte'
  import RepoList from '$lib/components/RepoList.svelte'

  const { data } = $props()
  const { repos } = data
</script>

<Breadcrumb items={[{ label: 'Dashboard', home: true }]} />

<MainHeader />

<RepoList title="Active projects 🔥" id="active-projects" repos={repos} />