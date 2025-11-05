import { GITHUB_TOKEN } from '$env/static/private';

export async function load() {
  try {
    const res = await fetch('https://api.github.com/rate_limit', {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'github-fdnd-agency-insights',
        Accept: 'application/vnd.github+json'
      }
    });

    if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);

    const data = await res.json();
    const core = data.rate;

    return {
      limit: core.limit,
      remaining: core.remaining,
      reset: new Date(core.reset * 1000) // convert epoch to JS date
    };
  } catch (err) {
    console.error('Failed to fetch rate limit:', err);
    return {
      limit: 0,
      remaining: 0,
      reset: null,
      error: err.message
    };
  }
}
