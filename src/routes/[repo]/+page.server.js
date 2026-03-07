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

    // Geen teams → niets te doen
    if (!teams || teams.length === 0) {
      return { org, repo, branches, teamMembers, totalCommits, pullRequestsByMember };
    }

    const teamSlug = teams[0].slug;
    if (!teamSlug) {
      return { org, repo, branches, teamMembers, totalCommits, pullRequestsByMember };
    }

    // Haal teamleden, branches en PR's parallel op
    const [members, branchData, allPRs] = await Promise.all([
      fetchTeamMembers(org, teamSlug, token),
      fetchRepoBranches(org, repo, token),
      fetchRepoPullRequests(org, repo, token)
    ]);

    teamMembers = members ?? [];

    // Geen teamleden → geen commits/PR's te tellen
    if (!teamMembers.length) {
      return { org, repo, branches, teamMembers, totalCommits, pullRequestsByMember };
    }

    // Init totalCommits voor alle leden
    totalCommits = Object.fromEntries(teamMembers.map((m) => [m.login, 0]));

    // Commits per branch en per member parallel ophalen
    if (branchData && branchData.length) {
      branches = await Promise.all(
        branchData.map(async (branch) => {
          const branchName = branch.name;
          const memberCommitCounts = {};

          await Promise.all(
            teamMembers.map(async (member) => {
              const count = await fetchCommitCount(
                org,
                repo,
                branchName,
                member.login,
                token
              );
              memberCommitCounts[member.login] = count;
              totalCommits[member.login] += count;
            })
          );

          return { name: branchName, memberCommitCounts };
        })
      );
    }

    // Voor elke member alvast PR-buckets klaarzetten
    pullRequestsByMember = Object.fromEntries(
      teamMembers.map((member) => [member.login, { open: [], closed: [] }])
    );

    // PR's toewijzen aan members (case-insensitive login-vergelijking)
    if (allPRs && allPRs.length) {
      const memberLookup = new Map(
        teamMembers.map((m) => [m.login.toLowerCase(), m.login])
      );

      for (const pr of allPRs) {
        const authorLogin = pr.user?.toLowerCase();
        if (!authorLogin) continue;

        const canonicalLogin = memberLookup.get(authorLogin);
        if (!canonicalLogin) continue;

        const bucket =
          pr.state === 'open'
            ? pullRequestsByMember[canonicalLogin].open
            : pullRequestsByMember[canonicalLogin].closed;

        bucket.push(pr);
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