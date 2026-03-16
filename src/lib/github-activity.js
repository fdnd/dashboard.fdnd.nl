import { fetchDashboardData } from '$lib/github-graphql.js';
import { fetchRepoContributorsStats } from '$lib/github.js';

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

/**
 * Aggregate activity per member across active repos.
 *
 * - "Active" = repo.metadata.status === "active" (case-insensitive)
 * - Members = all team members of those active repos
 * - Activity window = last `sinceDays` days (default: 30)
 * - Activity metrics:
 *   - commits (from /stats/contributors)
 *   - pullRequests (from GraphQL)
 *   - issues (from GraphQL)
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

  // 2. Seed all team members from active repos with 0 activity
  for (const repo of activeRepos) {
    const teamMembers = repo.team?.members ?? [];

    for (const m of teamMembers) {
      const login = m.login;
      if (!login) continue;

      const lower = login.toLowerCase();

      // Skip bots
      const isBot =
        m.type === 'Bot' ||
        lower.endsWith('[bot]') ||
        lower.includes('[bot]');

      if (isBot) continue;

      if (!memberMap.has(lower)) {
        memberMap.set(lower, {
          login,
          name: m.name ?? null,
          avatar_url: m.avatar_url ?? null,
          commits: 0,
          additions: 0,
          deletions: 0,
          netLines: 0,
          activeWeeks: 0,
          pullRequests: 0,
          issues: 0,
          activityCount: 0 // used for sorting (currently same as commits)
        });
      }
    }
  }

  // Helper: only use pre-seeded members (team members on active repos)
  function getMemberIfExists(login, avatar_url) {
    if (!login) return null;
    const key = login.toLowerCase();
    const member = memberMap.get(key);
    if (!member) return null;

    if (!member.avatar_url && avatar_url) {
      member.avatar_url = avatar_url;
    }
    return member;
  }

  // 3. For each active repo, pull contributor stats and add commits
  for (const repo of activeRepos) {
    const stats = await fetchRepoContributorsStats(org, repo.name, token);
    if (!stats || !Array.isArray(stats)) continue;

    for (const contributor of stats) {
      const login = contributor.login || '';
      const lower = login.toLowerCase();

      // Skip bots
      const isBot =
        contributor.type === 'Bot' ||
        lower.endsWith('[bot]') ||
        lower.includes('[bot]');

      if (isBot) continue;

      const member = getMemberIfExists(login, contributor.avatar_url);
      if (!member) continue;

      const recentWeeks = contributor.weeks.filter(
        (week) => week.w * 1000 >= sinceMs
      );

      const commits = recentWeeks.reduce(
        (sum, week) => sum + (week.c || 0),
        0
      );
      const additions = recentWeeks.reduce(
        (sum, week) => sum + (week.a || 0),
        0
      );
      const deletions = recentWeeks.reduce(
        (sum, week) => sum + (week.d || 0),
        0
      );
      const activeWeeks = recentWeeks.filter(
        (week) => (week.c || 0) > 0
      ).length;

      member.commits += commits;
      member.additions += additions;
      member.deletions += deletions;
      member.netLines += additions - deletions;
      member.activeWeeks += activeWeeks;
      member.activityCount += commits;
    }
  }

  // 4. Fetch PR and issue activity via a separate GraphQL query
  const activeRepoNames = activeRepos.map((r) => r.name);

  if (activeRepoNames.length > 0) {
    const prIssueData = await fetchPRAndIssueActivity({
      org,
      token,
      repoNames: activeRepoNames,
      sinceISO
    });

    Object.values(prIssueData).forEach((repoData) => {
      if (!repoData) return;

      const prs = repoData.pullRequests?.nodes ?? [];
      const iss = repoData.issues?.nodes ?? [];

      // For PRs we filter by date client-side
      const recentPRs = prs.filter((pr) => pr.createdAt >= sinceISO);

      for (const pr of recentPRs) {
        const login = pr.author?.login;
        if (!login) continue;
        const lower = login.toLowerCase();

        const isBot = lower.endsWith('[bot]') || lower.includes('[bot]');
        if (isBot) continue;

        const member = memberMap.get(lower);
        if (!member) continue;

        member.pullRequests += 1;
        // If you want PRs to influence ranking, uncomment:
        // member.activityCount += 1;
      }

      // Issues already filtered by `since` on the server,
      // but we can leave them as-is.
      for (const issue of iss) {
        const login = issue.author?.login;
        if (!login) continue;
        const lower = login.toLowerCase();

        const isBot = lower.endsWith('[bot]') || lower.includes('[bot]');
        if (isBot) continue;

        const member = memberMap.get(lower);
        if (!member) continue;

        member.issues += 1;
        // If you want issues to influence ranking, uncomment:
        // member.activityCount += 1;
      }
    });
  }

  // 5. Sorted list: most active → least active (by commits for now)
  const members = Array.from(memberMap.values()).sort(
    (a, b) => (b.activityCount || 0) - (a.activityCount || 0)
  );

  return {
    members,
    since: sinceISO
  };
}

/**
 * Build a separate GraphQL query based on repos from fetchDashboardData.
 * This keeps fetchDashboardData untouched (for SSG / rate-limits),
 * and only runs for the /activity page.
 */
async function fetchPRAndIssueActivity({ org, token, repoNames, sinceISO }) {
  if (!repoNames || repoNames.length === 0) return {};

  const repoFields = repoNames.map((name, i) => {
    const alias = `r${i}`;
    return `
      ${alias}: repository(owner: "${org}", name: "${name}") {
        name
        pullRequests(
          first: 50
          states: [OPEN, MERGED, CLOSED]
          orderBy: { field: CREATED_AT, direction: DESC }
        ) {
          nodes {
            author { login }
            createdAt
          }
        }
        issues(
          first: 50
          states: [OPEN, CLOSED]
          filterBy: { since: "${sinceISO}" }
          orderBy: { field: CREATED_AT, direction: DESC }
        ) {
          nodes {
            author { login }
            createdAt
          }
        }
      }
    `;
  }).join('\n');

  const query = `
    query ActivityPRsIssues {
      ${repoFields}
    }
  `;

  const res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('GitHub GraphQL error:', res.status, text);
    throw new Error(`GitHub GraphQL error: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    console.error('GitHub GraphQL errors:', JSON.stringify(json.errors, null, 2));
    throw new Error('GitHub GraphQL returned errors');
  }

  return json.data || {};
}