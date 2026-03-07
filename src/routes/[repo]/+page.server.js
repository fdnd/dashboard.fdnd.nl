import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private'
import {
  fetchRepoTeams,
  fetchTeamMembers,
  fetchRepoBranches,
  fetchBranchCommits,
  fetchRepoPullRequests
} from '$lib/github'

export const prerender = true

export async function load({ params }) {
  const org = GITHUB_ORGANIZATION
  const token = GITHUB_TOKEN
  const repo = params.repo

  const emptyResult = {
    org,
    repo,
    branches: [],
    teamMembers: [],
    totalCommits: {},
    pullRequestsByMember: {}
  }

  try {
    const teams = await fetchRepoTeams(org, repo, token)
    const teamSlug = teams?.[0]?.slug

    if (!teamSlug) {
      return emptyResult
    }

    const [members = [], branchData = [], allPRs = []] = await Promise.all([
      fetchTeamMembers(org, teamSlug, token),
      fetchRepoBranches(org, repo, token),
      fetchRepoPullRequests(org, repo, token)
    ])

    if (!members.length) {
      return {
        ...emptyResult,
        teamMembers: members
      }
    }

    const totalCommits = Object.fromEntries(members.map(m => [m.login, 0]))
    const memberLookup = new Map(
      members.map(m => [m.login.toLowerCase(), m.login])
    )

    // 6 months ago from now (build time if prerendered)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const sinceIso = sixMonthsAgo.toISOString()

    let branches = []

    if (branchData.length) {
      branches = await Promise.all(
        branchData.map(async branch => {
          const branchName = branch.name
          const memberCommitCounts = Object.fromEntries(
            members.map(m => [m.login, 0])
          )

          const commits = await fetchBranchCommits(
            org,
            repo,
            branchName,
            token,
            { maxCommits: 500, since: sinceIso }
          )

          if (Array.isArray(commits)) {
            for (const commit of commits) {
              const author = commit.author
              if (!author) continue

              const canonical = memberLookup.get(author.toLowerCase())
              if (!canonical) continue

              memberCommitCounts[canonical] += 1
              totalCommits[canonical] += 1
            }
          }

          return { name: branchName, memberCommitCounts }
        })
      )
    }

    const pullRequestsByMember = Object.fromEntries(
      members.map(member => [member.login, { open: [], closed: [] }])
    )

    if (allPRs.length) {
      const memberLookupForPrs = new Map(
        members.map(m => [m.login.toLowerCase(), m.login])
      )

      for (const pr of allPRs) {
        const authorLogin = pr.user?.toLowerCase()
        if (!authorLogin) continue

        const canonicalLogin = memberLookupForPrs.get(authorLogin)
        if (!canonicalLogin) continue

        const bucket =
          pr.state === 'open'
            ? pullRequestsByMember[canonicalLogin].open
            : pullRequestsByMember[canonicalLogin].closed

        bucket.push(pr)
      }
    }

    return {
      org,
      repo,
      branches,
      teamMembers: members,
      totalCommits,
      pullRequestsByMember
    }
  } catch (err) {
    console.error(`Failed to fetch data for repo ${repo}`, err)
    return emptyResult
  }
}