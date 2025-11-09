const API = "https://api.github.com";

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

export async function fetchOrgTeams(org, token) {
  return ghFetch(`${API}/orgs/${org}/teams?per_page=100`, token);
}

export async function fetchTeamRepos(org, team_slug, token) {
  return ghFetch(`${API}/orgs/${org}/teams/${team_slug}/repos?per_page=100`, token);
}

export async function fetchTeamMembers(org, team_slug, token) {
  return ghFetch(`${API}/orgs/${org}/teams/${team_slug}/members?per_page=100`, token);
}

export async function fetchRepoBranches(org, repo, token) {
  return ghFetch(`${API}/repos/${org}/${repo}/branches?per_page=100`, token);
}

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

export async function fetchRepoTeams(org, repo, token) {
  return ghFetch(`${API}/repos/${org}/${repo}/teams?per_page=100`, token);
}

export async function fetchRepoContributors(org, repo, token) {
  return ghFetch(`${API}/repos/${org}/${repo}/contributors?per_page=100`, token);
}

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

export async function fetchCommitStats(org, repo, sha, token) {
  try {
    const commit = await ghFetch(`${API}/repos/${org}/${repo}/commits/${sha}`, token);
    const filesChanged = commit.files?.length ?? 0;
    return { filesChanged }; // ✅ only return files changed
  } catch (err) {
    console.error(`Failed to fetch stats for commit ${sha}:`, err);
    return { filesChanged: 0 };
  }
}

export async function fetchRepoPullRequests(org, repo, token) {
  try {
    const prs = await ghFetch(
      `${API}/repos/${org}/${repo}/pulls?state=all&per_page=100`,
      token
    );

    return prs.map(pr => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      user: pr.user?.login ?? 'unknown', // <-- make sure we have a string
      state: pr.state,
      html_url: pr.html_url,
      merged_at: pr.merged_at,
      created_at: pr.created_at,
      updated_at: pr.updated_at
    }));
  } catch (err) {
    console.error(`Failed to fetch PRs for ${repo}:`, err);
    return [];
  }
}




