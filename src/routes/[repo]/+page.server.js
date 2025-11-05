import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private';
import { fetchRepoTeams, fetchTeamMembers, fetchRepoBranches, fetchCommitCount } from '$lib/github';

export async function load({ params }) {
  const org = GITHUB_ORGANIZATION;
  const token = GITHUB_TOKEN;
  const repo = params.repo;

  let branches = [];
  let teamMembers = [];
  let totalCommits = {};

  try {
    // Pick first team for this repo
    const teams = await fetchRepoTeams(org, repo, token);
    const teamSlug = teams.length > 0 ? teams[0].slug : null;

    if (teamSlug) {
      teamMembers = await fetchTeamMembers(org, teamSlug, token);

      const branchData = await fetchRepoBranches(org, repo, token);

      // Initialize total commits
      teamMembers.forEach(m => totalCommits[m.login] = 0);

      branches = await Promise.all(
        branchData.map(async (b) => {
          const branchName = b.name;
          const memberCommitCounts = {};

          await Promise.all(
            teamMembers.map(async (m) => {
              const count = await fetchCommitCount(org, repo, branchName, m.login, token);
              memberCommitCounts[m.login] = count;

              // Add to total commits
              totalCommits[m.login] += count;
            })
          );

          return { name: branchName, memberCommitCounts };
        })
      );
    }
  } catch (err) {
    console.error(`Failed to fetch team/branches for repo ${repo}:`, err);
    branches = [];
  }

  return { org, repo, branches, teamMembers, totalCommits };
}
