import yaml from 'js-yaml';

const API = "https://api.github.com";

/**
 * Helper function to fetch data from GitHub API
 */
export async function ghFetch(url, token, { raw = false, returnResponse = false } = {}) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'github-fdnd-agency-insights',
      Accept: raw ? 'application/vnd.github.v3.raw' : 'application/vnd.github+json'
    }
  })

  if (!response.ok) throw new Error(`GitHub request failed: ${response.status} ${response.statusText}`)
  return returnResponse ? response : raw ? response.text() : response.json()
}

/**
 * Helper function to safely fetch data and handle errors
 */
async function safeFetch(url, token, options = {}) {
  try {
    return await ghFetch(url, token, options)
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error)
    return null
  }
}

/**
 * Organization level
 */
export async function fetchOrgTeams(organization, token) {
  const url = `${API}/orgs/${organization}/teams?per_page=100`
  return ghFetch(url, token)
}

/**
 * Team level
 */
export async function fetchTeamRepos(organization, team, token) {
  const url = `${API}/orgs/${organization}/teams/${team}/repos?per_page=100`
  return ghFetch(url, token)
}

export async function fetchTeamMembers(organization, team, token) {
  const url = `${API}/orgs/${organization}/teams/${team}/members?per_page=100`
  return ghFetch(url, token)
}

/**
 * Repository level
 */
export async function fetchRepoBranches(organization, repository, token) {
  const url = `${API}/repos/${organization}/${repository}/branches?per_page=100`
  return ghFetch(url, token)
}

export async function fetchRepoTeams(organization, repository, token) {
  const url = `${API}/repos/${organization}/${repository}/teams?per_page=100`
  return ghFetch(url, token)
}

export async function fetchRepoContributors(organization, repository, token) {
  const url = `${API}/repos/${organization}/${repository}/contributors?per_page=100`
  return ghFetch(url, token)
}

export async function fetchRepoPullRequests(organization, repository, token) {
  const url = `${API}/repos/${organization}/${repository}/pulls?state=all&amp;per_page=100`
  const pullRequests = await safeFetch(url, token)
  return pullRequests
    ? pullRequests.map((pullRequest) => ({
        id: pullRequest.id,
        number: pullRequest.number,
        title: pullRequest.title,
        user: pullRequest.user?.login ?? 'unknown',
        state: pullRequest.state,
        html_url: pullRequest.html_url,
        merged_at: pullRequest.merged_at,
        created_at: pullRequest.created_at,
        updated_at: pullRequest.updated_at
      }))
    : []
}

export async function fetchRepoMetadata(owner, repository, token, branch = 'main') {
  const url = `${API}/repos/${owner}/${repository}/contents/repo_metadata.yml?ref=${encodeURIComponent(branch)}`
  const yamlText = await safeFetch(url, token, { raw: true })
  if (!yamlText || !yamlText.trim()) return {}
  try {
    return yaml.load(yamlText) || {}
  } catch (error) {
    console.error(`Failed to parse YAML for ${owner}/${repository}@${branch}:`, error)
    return {}
  }
}

/**
 * Commit-related functions
 */
export async function fetchCommitDetails(organization, repository, sha, token) {
  const url = `${API}/repos/${organization}/${repository}/commits/${sha}`
  const data = await safeFetch(url, token)
  return data
    ? {
        sha: data.sha,
        author: data.commit?.author?.name ?? data.author?.login,
        avatar_url: data.author?.avatar_url ?? null,
        message: data.commit?.message,
        date: data.commit?.author?.date,
        stats: data.stats ?? { total: 0, additions: 0, deletions: 0 },
        files:
          data.files?.map((file) => ({
            filename: file.filename,
            additions: file.additions,
            deletions: file.deletions,
            changes: file.changes
          })) ?? []
      }
    : null
}

export async function fetchBranchCommits(organization, repository, branch, token, maxCommits = 100) {
  const commits = []
  let page = 1
  let remaining = maxCommits
  const perPage = Math.min(100, remaining)

  while (remaining > 0) {
    const url = `${API}/repos/${organization}/${repository}/commits?sha=${branch}&amp;per_page=${perPage}&amp;page=${page}`
    const response = await safeFetch(url, token)
    if (!response || response.length === 0) break

    commits.push(
      ...response.map((commit) => ({
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

export async function fetchCommitCount(organization, repository, branch, username, token) {
  const url = `${API}/repos/${organization}/${repository}/commits?sha=${branch}&amp;author=${username}&amp;per_page=1`
  const response = await safeFetch(url, token, { returnResponse: true })
  if (!response) return 0

  const commits = await response.json()
  const link = response.headers.get('Link')
  if (!link) return commits.length

  const match = link.match(/&amp;page=(\d+)&gt;; rel="last"/)
  return match ? parseInt(match[1], 10) : commits.length
}

export async function fetchCommitStats(organization, repository, sha, token) {
  const url = `${API}/repos/${organization}/${repository}/commits/${sha}`
  const commit = await safeFetch(url, token)
  return { filesChanged: commit?.files?.length ?? 0 }
}



