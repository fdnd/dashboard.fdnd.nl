// src/lib/github-graphql.js
import { graphql } from '@octokit/graphql';
import yaml from 'js-yaml';

/**
 * Fetches all data needed for the dashboard:
 * - org teams
 * - per team: members + repos
 * - per repo: repo_metadata.yml + "epic" issues
 *
 * It returns { org, teams, repos } where each repo matches what
 * your existing Svelte components expect:
 * - repo.metadata.* (title, years, client, main_link, dev_link, tech_stack, status, ...)
 * - repo.team.members[*].login / .avatar_url
 * - repo.epics[*].url / .title (and some extra fields you may use later)
 */
export async function fetchDashboardData(org, token) {
  const client = graphql.defaults({
    headers: {
      authorization: `Bearer ${token}`
    }
  });

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
                    labels(first: 20) {
                      nodes {
                        name
                      }
                    }
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
  `;

  const variables = {
    org,
    teamCount: 50,
    memberCount: 50,
    repoCount: 75,  
    issueCount: 100 
  };

  const { organization } = await client(query, variables);

  if (!organization || !organization.teams) {
    return { org, teams: [], repos: [] };
  }

  const teams = organization.teams.nodes ?? [];
  const repos = [];

  for (const team of teams) {
    const rawMembers = team.members?.nodes ?? [];
    if (!rawMembers.length) continue;

    // Normalize members so RepoCard gets member.login + member.avatar_url
    const members = rawMembers.map((m) => ({
      login: m.login,
      avatar_url: m.avatarUrl
    }));

    for (const repo of team.repositories?.nodes ?? []) {
      // Parse YAML metadata if present
      let metadata = {};
      if (repo.metadata && repo.metadata.text) {
        try {
          metadata = yaml.load(repo.metadata.text) || {};
        } catch (e) {
          console.error(
            `Failed to parse repo_metadata.yml for ${repo.nameWithOwner}:`,
            e
          );
        }
      }

      // Map epic issues to what RepoCard uses (url + title; extra fields are ok)
      const issues = repo.issues?.nodes ?? [];
      const epics = issues.map((issue) => ({
        number: issue.number,
        title: issue.title,
        url: issue.url,
        body: issue.body,
        state: issue.state,
        labels: issue.labels?.nodes?.map((l) => l.name) ?? [],
        user: issue.author
          ? {
              login: issue.author.login,
              avatar_url: issue.author.avatarUrl
            }
          : null
      }));

      repos.push({
        name: repo.name,                  // used in RepoCard links and keys
        full_name: repo.nameWithOwner,
        html_url: repo.url,
        default_branch: repo.defaultBranchRef?.name ?? 'main',
        metadata,                         // repo_metadata.yml; used for title, years, links, tech_stack, client, status
        team: {
          name: team.name,
          slug: team.slug,
          members                         // normalized members with avatar_url
        },
        epics,                            // used in RepoCard for modal + button
        epic_summary: epics.length
      });
    }
  }

  // Deduplicate repos (in case multiple teams can access the same repo)
  const uniqueRepos = Array.from(
    new Map(repos.map((r) => [r.full_name, r])).values()
  );

  return {
    org,
    teams,
    repos: uniqueRepos
  };
}