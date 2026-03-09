const API = 'https://api.github.com'

/**
 * Low-level GitHub fetch helper
 */
export async function ghFetch(url, token, { raw = false, returnResponse = false } = {}) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'github-fdnd-agency-insights',
      Accept: raw ? 'application/vnd.github.v3.raw' : 'application/vnd.github+json'
    }
  })

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${response.statusText}`)
  }

  return returnResponse ? response : raw ? response.text() : response.json()
}

/**
 * Helper to log and recover from errors
 */
async function safeFetch(url, token, options = {}) {
  try {
    return await ghFetch(url, token, options)
  } catch (error) {
    console.error(`Failed to fetch from ${url}`, error)
    return null
  }
}

/**
 * Weekly commit activity per contributor for a repo.
 * Uses: GET /repos/{owner}/{repo}/stats/contributors
 *
 * Returns simplified data:
 * [
 *   {
 *     login,
 *     avatar_url,
 *     weeks: [{ w, a, d, c }, ...]  // w = unix timestamp (sec), c = commits
 *   }
 * ]
 *
 * NOTE: GitHub may return 202 while calculating stats.
 * safeFetch will then return null and we treat it as "no data yet".
 */
export async function fetchRepoContributorsStats(organization, repository, token) {
  const url = `${API}/repos/${organization}/${repository}/stats/contributors`;

  try {
    // Get raw response so we can inspect status
    const response = await ghFetch(url, token, { returnResponse: true });

    // GitHub is still generating stats
    if (response.status === 202) {
      console.warn(
        'Contributors stats not ready yet for',
        `${organization}/${repository} (202 Accepted)`
      );
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn(
        'Unexpected contributors stats response for',
        `${organization}/${repository}`,
        data
      );
      return [];
    }

    // Map to a simplified shape, but keep author.type so we can detect bots
    return data.map((item) => ({
      login: item.author?.login ?? 'unknown',
      avatar_url: item.author?.avatar_url ?? null,
      type: item.author?.type ?? null, // "User", "Bot", etc.
      weeks: item.weeks ?? []
    }));
  } catch (error) {
    console.error(
      'Failed to fetch contributors stats for',
      `${organization}/${repository}`,
      error
    );
    return [];
  }
}

/**
 * Repository-level helpers used by the repo routes
 */

// Teams for a given repo
export async function fetchRepoTeams(organization, repository, token) {
  const url = `${API}/repos/${organization}/${repository}/teams?per_page=100`
  return safeFetch(url, token)
}

// Members of a team
export async function fetchTeamMembers(organization, team, token) {
  const url = `${API}/orgs/${organization}/teams/${team}/members?per_page=100`
  return safeFetch(url, token)
}

// Branch list
export async function fetchRepoBranches(organization, repository, token) {
  const url = `${API}/repos/${organization}/${repository}/branches?per_page=100`
  return safeFetch(url, token)
}

// Pull requests (open + closed) for a repo
export async function fetchRepoPullRequests(organization, repository, token) {
  const url = `${API}/repos/${organization}/${repository}/pulls?state=all&per_page=100`
  const pullRequests = await safeFetch(url, token)

  return pullRequests
    ? pullRequests.map(pr => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        user: pr.user?.login ?? 'unknown',
        state: pr.state,
        html_url: pr.html_url,
        merged_at: pr.merged_at,
        created_at: pr.created_at,
        updated_at: pr.updated_at
      }))
    : []
}

// Commit details for a specific SHA (used on /repo/branch/commit)
export async function fetchCommitDetails(organization, repository, sha, token) {
  const url = `${API}/repos/${organization}/${repository}/commits/${sha}`
  const data = await safeFetch(url, token)

  if (!data) return null

  return {
    sha: data.sha,
    author: data.commit?.author?.name ?? data.author?.login,
    avatar_url: data.author?.avatar_url ?? null,
    message: data.commit?.message,
    date: data.commit?.author?.date,
    stats: data.stats ?? { total: 0, additions: 0, deletions: 0 },
    files:
      data.files?.map(file => ({
        filename: file.filename,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes
      })) ?? []
  }
}

/**
 * Commits for a branch.
 *
 * Used in:
 * - /repo/branch (to list commits)
 * - /repo (to aggregate commit counts per member)
 *
 * Only commits since the optional `since` date are returned,
 * and at most `maxCommits` are fetched.
 */
export async function fetchBranchCommits(
  organization,
  repository,
  branch,
  token,
  { maxCommits = 500, since } = {}
) {
  const commits = []
  let page = 1
  let remaining = maxCommits

  while (remaining > 0) {
    const perPage = Math.min(100, remaining)

    const params = new URLSearchParams()
    params.set('sha', branch)
    params.set('per_page', String(perPage))
    params.set('page', String(page))
    if (since) {
      params.set('since', since)
    }

    const url = `${API}/repos/${organization}/${repository}/commits?${params.toString()}`
    const response = await safeFetch(url, token)
    if (!response || response.length === 0) break

    commits.push(
      ...response.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        date: commit.commit.author.date,
        author: commit.author?.login ?? commit.commit.author.name,
        avatar_url: commit.author?.avatar_url ?? null
      }))
    )

    if (response.length < perPage) break

    page++
    remaining -= response.length
  }

  return commits
}