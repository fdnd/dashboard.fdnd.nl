// src/routes/+layout.server.js
import {
  GITHUB_TOKEN,
  NETLIFY_SITE_ID,
  NETLIFY_TOKEN
} from '$env/static/private';

export async function load() {
  let limit = 0;
  let remaining = 0;
  let reset = null;
  let error = null;

  let latestDeployAt = null;
  let netlifyError = null;

  // --- GitHub rate limit ---
  try {
    const res = await fetch('https://api.github.com/rate_limit', {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'github-fdnd-agency-insights',
        Accept: 'application/vnd.github+json'
      }
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const core = data.rate;

    limit = core.limit;
    remaining = core.remaining;
    reset = new Date(core.reset * 1000).toISOString(); // send as string
    error = null;
  } catch (err) {
    console.error('Failed to fetch rate limit:', err);
    error = err?.message || 'Unknown GitHub error';
  }

  // --- Netlify latest deploy ---
  if (!NETLIFY_SITE_ID || !NETLIFY_TOKEN) {
    netlifyError = 'NETLIFY_SITE_ID or NETLIFY__TOKEN missing';
  } else {
    try {
      const res = await fetch(
        `https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/deploys?per_page=1`,
        {
          headers: {
            Authorization: `Bearer ${NETLIFY_TOKEN}`
          }
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Netlify API error: ${res.status} ${res.statusText} – ${text}`
        );
      }

      const deploys = await res.json();
      const latest = deploys[0];

      if (latest) {
        // prefer published_at, fall back to created_at
        latestDeployAt = latest.published_at || latest.created_at || null;
      } else {
        latestDeployAt = null;
        netlifyError = 'No deploys returned from Netlify API';
      }
    } catch (err) {
      console.error('Failed to fetch Netlify latest deploy:', err);
      netlifyError = err?.message || 'Unknown Netlify error';
    }
  }

  return {
    limit,
    remaining,
    reset, 
    error,
    latestDeployAt, 
    netlifyError
  };
}
