<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import MainHeader from '$lib/components/MainHeader.svelte'
  import RepoList from '$lib/components/RepoList.svelte'

  let { data } = $props()
</script>

<Breadcrumb items={[{ label: 'Dashboard', home: true }]} />

<MainHeader />

<RepoList
  title="Year 1 projects"
  id="year-1-projects"
  repos={data.yearOneRepos}
/>

<RepoList
  title="Year 2 projects"
  id="year-2-projects"
  repos={data.yearTwoRepos}
/>