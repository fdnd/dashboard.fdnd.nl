import { fetchDashboardData } from '$lib/github-graphql.js';
import { fetchRepoContributorsStats } from '$lib/github.js';

/**
 * Aggregate activity per member across active repos.
 *
 * - "Active" = repo.metadata.status === "active" (case-insensitive)
 * - Members = all team members of those active repos
 * - Activity = number of commits in the last `sinceDays` days
 *   based on /repos/{owner}/{repo}/stats/contributors
 */
export async function fetchMemberActivity({
  org,
  token,
  sinceDays = 30
} = {}) {
  const { repos } = await fetchDashboardData(org, token);

  if (!repos || repos.length === 0) {
    return { members: [], since: null };
  }

  const now = new Date();
  const sinceDate = new Date(now.getTime() - sinceDays * 24 * 60 * 60 * 1000);
  const sinceMs = sinceDate.getTime();
  const sinceISO = sinceDate.toISOString();

  // 1. Only repos with status: "active"
  const activeRepos = repos.filter((repo) => {
    const status = repo.metadata?.status;
    if (!status) return false;
    return String(status).toLowerCase() === 'active';
  });

  const memberMap = new Map();

  // 2. Seed all team members from active repos with 0 activity & skip bots
  for (const repo of activeRepos) {
  const stats = await fetchRepoContributorsStats(org, repo.name, token);

  for (const contributor of stats) {
    const login = contributor.login || '';

    // Skip bots:
    // - GitHub marks them as type "Bot"
    // - And many have login names like "something[bot]"
    const isBot =
      contributor.type === 'Bot' ||
      login.toLowerCase().endsWith('[bot]') ||
      login.toLowerCase().includes('[bot]');

    if (isBot) continue;

    const member = getMemberIfExists(login, contributor.avatar_url);
    if (!member) continue;

    const recentCommits = contributor.weeks
      .filter((week) => week.w * 1000 >= sinceMs)
      .reduce((sum, week) => sum + (week.c || 0), 0);

    member.commits += recentCommits;
    member.activityCount += recentCommits;
  }
}

  // Helper: get existing member, but NEVER create new ones
  // (so we only count activity for team members of active projects)
  function getMemberIfExists(login, avatar_url) {
    if (!login) return null;

    const key = login.toLowerCase();
    const member = memberMap.get(key);
    if (!member) return null;

    // backfill avatar if we learn a better one
    if (!member.avatar_url && avatar_url) {
      member.avatar_url = avatar_url;
    }
    return member;
  }

  // 3. For each active repo, pull contributor stats and add commits
  for (const repo of activeRepos) {
    const stats = await fetchRepoContributorsStats(org, repo.name, token);

    for (const contributor of stats) {
      const member = getMemberIfExists(
        contributor.login,
        contributor.avatar_url
      );
      if (!member) continue;

      // weeks: [{ w, a, d, c }]
      const recentCommits = contributor.weeks
        .filter((week) => week.w * 1000 >= sinceMs)
        .reduce((sum, week) => sum + (week.c || 0), 0);

      member.commits += recentCommits;
      member.activityCount += recentCommits;
    }
  }

  // 4. Sorted list: most active → least active
  const members = Array.from(memberMap.values()).sort(
    (a, b) => (b.activityCount || 0) - (a.activityCount || 0)
  );

  return {
    members,
    since: sinceISO
  };
}