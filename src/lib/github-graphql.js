import { graphql } from '@octokit/graphql'
import yaml from 'js-yaml'

export async function fetchDashboardData(org, token) {
  const client = graphql.defaults({
    headers: {
      authorization: `Bearer ${token}`
    }
  })

  const query = `
    query OrgDashboard(
      $org: String!,
      $teamCount: Int!,
      $memberCount: Int!,
      $repoCount: Int!,
      $issueCount: Int!
    ) {
      organization(login: $org) {
        teams(first: $teamCount) {
          nodes {
            name
            slug
            members(first: $memberCount) {
              nodes {
                login
                avatarUrl
              }
            }
            repositories(first: $repoCount) {
              nodes {
                name
                nameWithOwner
                url
                defaultBranchRef {
                  name
                }
                metadata: object(expression: "HEAD:repo_metadata.yml") {
                  ... on Blob {
                    text
                  }
                }
                issues(first: $issueCount, labels: ["epic"], states: [OPEN]) {
                  nodes {
                    number
                    title
                    url
                    body
                    state
                    author {
                      login
                      avatarUrl
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const variables = {
    org,
    teamCount: 50,
    memberCount: 50,
    repoCount: 60,  
    issueCount: 100 
  }

  const { organization } = await client(query, variables)

  if (!organization || !organization.teams) {
    return { org, teams: [], repos: [] }
  }

  const teams = organization.teams.nodes ?? []
  const repos = []

  for (const team of teams) {
    const rawMembers = team.members?.nodes ?? []
    if (!rawMembers.length) continue

    const members = rawMembers.map((m) => ({
      login: m.login,
      avatar_url: m.avatarUrl
    }))

    for (const repo of team.repositories?.nodes ?? []) {
      let metadata = {}
      if (repo.metadata && repo.metadata.text) {
        try {
          metadata = yaml.load(repo.metadata.text) || {}
        } catch (e) {
          console.error(
            `Failed to parse repo_metadata.yml for ${repo.nameWithOwner}:`,
            e
          )
        }
      }

      const issues = repo.issues?.nodes ?? []
      const epics = issues.map((issue) => ({
        number: issue.number,
        title: issue.title,
        url: issue.url,
        body: issue.body,
        state: issue.state,
        user: issue.author
          ? {
              login: issue.author.login,
              avatar_url: issue.author.avatarUrl
            }
          : null
      }))

      repos.push({
        name: repo.name,                  
        full_name: repo.nameWithOwner,
        html_url: repo.url,
        default_branch: repo.defaultBranchRef?.name ?? 'main',
        metadata,                         
        team: {
          name: team.name,
          slug: team.slug,
          members                         
        },
        epics,                           
        epic_summary: epics.length
      })
    }
  }

  const uniqueRepos = Array.from(
    new Map(repos.map((repo) => [repo.full_name, repo])).values()
  )

  return {
    org,
    teams,
    repos: uniqueRepos
  }
}