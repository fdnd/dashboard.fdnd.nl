import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private';
import { fetchCommitDetails } from '$lib/github';

export const prerender = true; // keep static

export async function load({ params }) {
  const org = GITHUB_ORGANIZATION;
  const token = GITHUB_TOKEN;
  const repo = params.repo;
  const sha = params.commit; // full commit SHA

  let details = null;

  try {
    details = await fetchCommitDetails(org, repo, sha, token);
  } catch (err) {
    // Gracefully skip commits that cause 404 or 422
    console.warn(`Skipping commit ${sha} in ${repo}: ${err.message}`);
    details = null;
  }

  return { org, repo, sha, details };
}
