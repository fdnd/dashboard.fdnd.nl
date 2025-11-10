import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private'
import { fetchBranchCommits } from '$lib/github'

export const prerender = false

export async function load({ params }) {
  const org = GITHUB_ORGANIZATION
  const token = GITHUB_TOKEN
  const repo = params.repo
  const branch = params.branch

  const commits = await fetchBranchCommits(org, repo, branch, token, 50)

  return { org, repo, branch, commits }
}
