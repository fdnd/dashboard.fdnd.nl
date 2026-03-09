import { GITHUB_TOKEN, GITHUB_ORGANIZATION } from '$env/static/private'
import { fetchMemberActivity } from '$lib/github-activity.js'

export async function load() {
  const org = GITHUB_ORGANIZATION

  try {
    const { members, since } = await fetchMemberActivity({
      org,
      token: GITHUB_TOKEN,
      sinceDays: 30
    })

    return {
      org,
      since,
      members
    }
  } catch (err) {
    console.error('Failed to load /activity data:', err)

    return {
      org,
      since: null,
      members: [],
      error: err?.message || 'Unknown error fetching activity'
    }
  }
}