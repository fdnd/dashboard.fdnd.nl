import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private';
import { fetchOrgTeams, fetchTeamRepos, fetchTeamMembers } from '$lib/github';

export async function load() {
  const org = GITHUB_ORGANIZATION;
  const token = GITHUB_TOKEN;

  // 1️⃣ Get all teams
  const teams = await fetchOrgTeams(org, token);
  const reposWithTeams = [];

  // 2️⃣ Iterate over each team and fetch repos
  for (const team of teams) {
    const teamRepos = await fetchTeamRepos(org, team.slug, token);

    // Fetch members for the team
    const members = await fetchTeamMembers(org, team.slug, token);

    // Only include repos if the team has members
    if (members.length === 0) continue;

    for (const repo of teamRepos) {
      reposWithTeams.push({
        ...repo,
        team: { name: team.name, slug: team.slug, members }
      });
    }
  }

  // Deduplicate repos in case multiple teams have access
  const uniqueRepos = Array.from(new Map(reposWithTeams.map(r => [r.full_name, r])).values());

  return { org, repos: uniqueRepos, teams };
}
