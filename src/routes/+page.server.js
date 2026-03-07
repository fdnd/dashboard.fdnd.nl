import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private'
import { fetchDashboardData } from '$lib/github-graphql'

export const prerender = true

export async function load() {
  const org = GITHUB_ORGANIZATION
  const token = GITHUB_TOKEN

  const { teams, repos } = await fetchDashboardData(org, token)

  return { org, teams, repos }
}