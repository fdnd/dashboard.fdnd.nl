import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private'
import { fetchBranchCommits } from '$lib/github'

export const prerender = false

export async function load({ params }) {
  const org = GITHUB_ORGANIZATION
  const token = GITHUB_TOKEN
  const repo = params.repo
  const branch = params.branch

  let commits = []

  try {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const sinceIso = sixMonthsAgo.toISOString()

    commits =
      (await fetchBranchCommits(org, repo, branch, token, {
        maxCommits: 50,
        since: sinceIso
      })) ?? []
  } catch (err) {
    console.error(`Failed to fetch commits for ${org}/${repo}@${branch}:`, err)
  }

  return { org, repo, branch, commits }
}