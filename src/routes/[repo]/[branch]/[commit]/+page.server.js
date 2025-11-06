import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private';
import { fetchCommitDetails } from '$lib/github';

export async function load({ params }) {
  const org = GITHUB_ORGANIZATION;
  const token = GITHUB_TOKEN;
  const repo = params.repo;
  const sha = params.commit; // must be SHA, not branch name

  const details = await fetchCommitDetails(org, repo, sha, token);

  return { org, repo, sha, details };
}
