<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import MainHeader from '$lib/components/MainHeader.svelte'
  import RepoList from '$lib/components/RepoList.svelte'

  const { data } = $props()
  const { repos } = data

  const { active, inactive } = repoStatusGroups()

  function repoStatusGroups () {
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
</script>

<Breadcrumb items={[{ label: 'Dashboard', home: true }]} />

<MainHeader />

<RepoList title="Active projects 🔥" id="active-projects" status="active" repos={active} />
<RepoList title="Inactive projects 🧊" id="inactive-projects" status="inactive" repos={inactive} />