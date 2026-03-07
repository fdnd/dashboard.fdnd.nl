import { error } from '@sveltejs/kit'
import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private'
import { fetchCommitDetails } from '$lib/github'

export const prerender = false

export async function load({ params }) {
  const { repo, branch, commit } = params
  const org = GITHUB_ORGANIZATION
  const token = GITHUB_TOKEN

  let details = null

  try {
    details = await fetchCommitDetails(org, repo, commit, token)
  } catch (err) {
    console.error(
      `Failed to fetch commit details for ${org}/${repo}@${branch} (${commit}):`,
      err
    )
  }

  return { repo, branch, sha: commit, details }
}