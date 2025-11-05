import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private'
import { fetchOrgTeams, fetchTeamRepos, fetchTeamMembers } from '$lib/github'

export async function load() {
  const org = GITHUB_ORGANIZATION
  const token = GITHUB_TOKEN

  // 1️⃣ Get all teams
  const teams = await fetchOrgTeams(org, token)

  const reposWithTeams = []

  // 2️⃣ Iterate over each team and fetch repos
  for (const team of teams) {
    const teamRepos = await fetchTeamRepos(org, team.slug, token)
    for (const repo of teamRepos) {
      // Attach team info
      reposWithTeams.push({
        ...repo,
        team: { name: team.name, slug: team.slug }
      })
    }
  }

  // Optional: deduplicate repos if multiple teams have access
  const uniqueRepos = Array.from(new Map(reposWithTeams.map(r => [r.full_name, r])).values())

  return { org, repos: uniqueRepos, teams }
}
