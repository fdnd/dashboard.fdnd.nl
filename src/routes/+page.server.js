import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private'
import { fetchDashboardData } from '$lib/github-graphql'

export const prerender = true

export async function load() {
  const org = GITHUB_ORGANIZATION
  const token = GITHUB_TOKEN

  const { teams, repos } = await fetchDashboardData(org, token)
  const yearOneRepos = repos.filter((repo) => repo.metadata?.years?.includes(1))
  const yearTwoRepos = repos.filter((repo) => repo.metadata?.years?.includes(2))

  const occurrenceCounts = new Map()
  for (const repo of [...yearOneRepos, ...yearTwoRepos]) {
    occurrenceCounts.set(
      repo.name,
      (occurrenceCounts.get(repo.name) ?? 0) + 1
    )
  }

  function addCardIds(yearRepos, year) {
    return yearRepos.map((repo) => {
      return {
        ...repo,
        cardId: occurrenceCounts.get(repo.name) > 1
          ? `${repo.name}-year-${year}`
          : repo.name
      }
    })
  }

  return {
    org,
    teams,
    yearOneRepos: addCardIds(yearOneRepos, 1),
    yearTwoRepos: addCardIds(yearTwoRepos, 2)
  }
}