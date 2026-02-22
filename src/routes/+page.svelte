<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import RepoList from '$lib/components/RepoList.svelte'

  const { data } = $props()
  const repos = data.repos

  console.log(repos)

  const repoGroups = () => {
    const active = []
    const inactive = []

    for (const repo of repos) {
      if (repo.metadata?.status === 'active') {
        active.push(repo)
      } else {
        inactive.push(repo)
      }
    }

    return { active, inactive }
  }

  const { active, inactive } = repoGroups()
</script>

<Breadcrumb items={[{ label: 'Dashboard', home: true }]} />

<header>
  <h1>FDND Agency</h1>
</header>

<RepoList
  title="Active projects 🔥"
  id="active-projects"
  status="active"
  repos={active}
/>

<RepoList
  title="Inactive projects 🧊"
  id="inactive-projects"
  status="inactive"
  repos={inactive}
/>

<style>
  header {
    h1 {
      font-weight: normal;
    }
  }
</style>