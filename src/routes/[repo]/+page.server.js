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
  let openPRs = [];
  let closedPRs = [];
  let mergedPRs = [];
  let pullRequestStats = {};

  try {
    const teams = await fetchRepoTeams(org, repo, token);
    const teamSlug = teams.length > 0 ? teams[0].slug : null;

    if (teamSlug) {
      teamMembers = await fetchTeamMembers(org, teamSlug, token);
      const branchData = await fetchRepoBranches(org, repo, token);

      teamMembers.forEach(m => (totalCommits[m.login] = 0));

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

      const prs = await fetchRepoPullRequests(org, repo, token);

      teamMembers.forEach(m => {
        pullRequestStats[m.login] = { open: 0, closed: 0, merged: 0, total: 0 };
      });

      openPRs = [];
      closedPRs = [];
      mergedPRs = [];

      for (const pr of prs) {
        const author = pr.user?.login?.toLowerCase();
        const matchedMember = teamMembers.find(m => m.login.toLowerCase() === author);

        if (pr.merged_at) {
          mergedPRs.push(pr);
          closedPRs.push(pr);
        } else if (pr.state === 'open') {
          openPRs.push(pr);
        } else {
          closedPRs.push(pr);
        }

        if (matchedMember && pullRequestStats[matchedMember.login]) {
          const stats = pullRequestStats[matchedMember.login];
          stats.total += 1;

          if (pr.merged_at) {
            stats.merged += 1;
            stats.closed += 1; 
          } else if (pr.state === 'open') {
            stats.open += 1;
          } else {
            stats.closed += 1;
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
    openPRs, 
    closedPRs, 
    mergedPRs,
    pullRequestStats
  };
}
