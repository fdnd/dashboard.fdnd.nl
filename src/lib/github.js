const API = "https://api.github.com";

/**
 * Generic GitHub fetch helper
 */
export async function ghFetch(url, token) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'github-fdnd-agency-insights',
      Accept: 'application/vnd.github+json'
    }
  });

  if (!res.ok) {
    throw new Error(`GitHub request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * ======================
 * Org-level functions
 * ======================
 */

/**
 * Fetch all teams in the org
 */
export async function fetchOrgTeams(org, token) {
  return ghFetch(`${API}/orgs/${org}/teams?per_page=100`, token);
}

/**
 * Fetch repos a team has access to
 */
export async function fetchTeamRepos(org, team_slug, token) {
  return ghFetch(`${API}/orgs/${org}/teams/${team_slug}/repos?per_page=100`, token);
}

/**
 * Fetch members of a team
 */
export async function fetchTeamMembers(org, team_slug, token) {
  return ghFetch(`${API}/orgs/${org}/teams/${team_slug}/members?per_page=100`, token);
}

/**
 * ======================
 * Repo-level functions
 * ======================
 */

/**
 * Fetch all branches for a repo
 */
export async function fetchRepoBranches(org, repo, token) {
  return ghFetch(`${API}/repos/${org}/${repo}/branches?per_page=100`, token);
}

/**
 * Fetch commit count for a branch and author using Link header
 */
export async function fetchCommitCount(org, repo, branch, username, token) {
  try {
    const res = await fetch(
      `${API}/repos/${org}/${repo}/commits?sha=${branch}&author=${username}&per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'github-fdnd-agency-insights',
          Accept: 'application/vnd.github+json'
        }
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch commits: ${res.status}`);
      return 0;
    }

    const commits = await res.json();
    const link = res.headers.get('Link');

    if (!link) return commits.length;

    const match = link.match(/&page=(\d+)>; rel="last"/);
    if (!match) return commits.length;

    const lastPage = parseInt(match[1], 10);
    return lastPage;

  } catch (err) {
    console.error(`Failed to fetch commits for ${username} on ${branch}:`, err);
    return 0;
  }
}

/**
 * Optional: other repo-level functions (if needed)
 */
export async function fetchRepoTeams(org, repo, token) {
  return ghFetch(`${API}/repos/${org}/${repo}/teams?per_page=100`, token);
}

export async function fetchRepoContributors(org, repo, token) {
  return ghFetch(`${API}/repos/${org}/${repo}/contributors?per_page=100`, token);
}

/**
 * Fetch detailed information for a specific commit.
 * Includes changed files, additions, deletions, and stats.
 */
export async function fetchCommitDetails(org, repo, sha, token) {
  const API = "https://api.github.com";

  try {
    const data = await ghFetch(`${API}/repos/${org}/${repo}/commits/${sha}`, token);

    return {
      sha: data.sha,
      author: data.commit?.author?.name ?? data.author?.login,
      avatar_url: data.author?.avatar_url ?? null,
      message: data.commit?.message,
      date: data.commit?.author?.date,
      stats: data.stats ?? { total: 0, additions: 0, deletions: 0 },
      files: data.files?.map(f => ({
        filename: f.filename,
        additions: f.additions,
        deletions: f.deletions,
        changes: f.changes
      })) ?? []
    };
  } catch (err) {
    console.error(`Failed to fetch commit details for ${repo}@${sha}:`, err);
    throw new Error(`Could not load commit details`);
  }
}


/**
 * Fetch all commits for a branch
 * Optionally limits to the latest `maxCommits` for rate-limit safety
 */
export async function fetchBranchCommits(org, repo, branch, token, maxCommits = 100) {
  const commits = [];
  let page = 1;
  let remaining = maxCommits;
  const perPage = Math.min(100, remaining);

  while (remaining > 0) {
    try {
      const res = await ghFetch(
        `https://api.github.com/repos/${org}/${repo}/commits?sha=${branch}&per_page=${perPage}&page=${page}`,
        token
      );

      if (res.length === 0) break;

      commits.push(
        ...res.map(c => ({
          sha: c.sha,
          message: c.commit.message,
          date: c.commit.author.date,
          author: c.author?.login ?? c.commit.author.name,
          avatar_url: c.author?.avatar_url ?? null
        }))
      );

      if (res.length < perPage) break; // last page
      page++;
      remaining -= res.length;
    } catch (err) {
      console.error(`Failed to fetch commits for branch ${branch} in ${repo}:`, err);
      break;
    }
  }

  return commits;
}

