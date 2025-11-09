import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private';
import { 
  fetchRepoTeams, 
  fetchTeamMembers, 
  fetchRepoBranches, 
  fetchCommitCount,
  fetchRepoPullRequests
} from '$lib/github';

export const prerender = false;

export async function load({ params }) {
  const org = GITHUB_ORGANIZATION;
  const token = GITHUB_TOKEN;
  const repo = params.repo;

  let branches = [];
  let teamMembers = [];
  let totalCommits = {};
  let pullRequestsByMember = {};

  try {
    const teams = await fetchRepoTeams(org, repo, token);
    const teamSlug = teams.length > 0 ? teams[0].slug : null;

    if (teamSlug) {
      teamMembers = await fetchTeamMembers(org, teamSlug, token);

      teamMembers.forEach(m => (totalCommits[m.login] = 0));

      const branchData = await fetchRepoBranches(org, repo, token);

      branches = await Promise.all(
        branchData.map(async (b) => {
          const branchName = b.name;
          const memberCommitCounts = {};

          await Promise.all(
            teamMembers.map(async (m) => {
              const count = await fetchCommitCount(org, repo, branchName, m.login, token);
              memberCommitCounts[m.login] = count;
              totalCommits[m.login] += count;
            })
          );

          return { name: branchName, memberCommitCounts };
        })
      );

      const allPRs = await fetchRepoPullRequests(org, repo, token);

      teamMembers.forEach(m => {
        pullRequestsByMember[m.login] = { open: [], closed: [] };
      });

      for (const pr of allPRs) {
        const authorLogin = pr.user?.toLowerCase();
        const member = teamMembers.find(m => m.login.toLowerCase() === authorLogin);

        if (member) {
          if (pr.state === 'open') {
            pullRequestsByMember[member.login].open.push(pr);
          } else {
            pullRequestsByMember[member.login].closed.push(pr);
          }
        }
      }
    }
  } catch (err) {
    console.error(`Failed to fetch data for repo ${repo}:`, err);
  }

  return { 
    org, 
    repo, 
    branches, 
    teamMembers, 
    totalCommits, 
    pullRequestsByMember
  };
}
