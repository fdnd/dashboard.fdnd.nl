import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private'
import { fetchOrgTeams, fetchTeamRepos, fetchTeamMembers, fetchRepoMetadata } from '$lib/github'

export const prerender = true

export async function load() {
  const org = GITHUB_ORGANIZATION
  const token = GITHUB_TOKEN

  const teams = await fetchOrgTeams(org, token)
  const reposWithTeams = []

  for (const team of teams) {
    const teamRepos = await fetchTeamRepos(org, team.slug, token)
    const members = await fetchTeamMembers(org, team.slug, token)

    if (members.length === 0) continue

    for (const repo of teamRepos) {
      let metadata = {}
      try {
        metadata = await fetchRepoMetadata(org, repo.name, token)
      } catch (err) {
        console.error(`Failed to fetch metadata for ${repo.name}:`, err)
      }

      reposWithTeams.push({
        ...repo,
        team: { name: team.name, slug: team.slug, members },
        metadata
      })
    }
  }

  // deduplicate repos if multiple teams have access
  const uniqueRepos = Array.from(new Map(reposWithTeams.map(r => [r.full_name, r])).values())

  return { org, repos: uniqueRepos, teams }
}
