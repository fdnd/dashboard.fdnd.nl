// src/routes/[repo]/[branch]/[commit]/+page.server.js
import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private'
import { fetchCommitDetails } from '$lib/github'

export const prerender = false // no need to prerender all commits

export async function load({ params }) {
  const { repo, branch, commit } = params
  const org = GITHUB_ORGANIZATION
  const token = GITHUB_TOKEN

  try {
    const details = await fetchCommitDetails(org, repo, commit, token)
    return { repo, branch, sha: commit, details }
  } catch (err) {
    console.error(`Failed to fetch commit details for ${repo}@${branch}:`, err)
    return { repo, branch, sha: commit, details: null }
  }
}
