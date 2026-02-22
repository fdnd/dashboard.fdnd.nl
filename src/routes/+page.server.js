// +page.server.js

import { GITHUB_ORGANIZATION, GITHUB_TOKEN } from '$env/static/private';
import {
  fetchOrgTeams,
  fetchTeamRepos,
  fetchTeamMembers,
  fetchRepoMetadata,
  fetchEpicsForRepositories
} from '$lib/github';

export const prerender = true;

export async function load() {
  const org = GITHUB_ORGANIZATION;
  const token = GITHUB_TOKEN;

  // Fetch all teams in the organization
  const teams = await fetchOrgTeams(org, token);

  const reposWithTeams = [];

  // For each team, fetch members and repos
  for (const team of teams) {
    const members = await fetchTeamMembers(org, team.slug, token);

    // Skip teams without members
    if (!members || members.length === 0) continue;

    const teamRepos = await fetchTeamRepos(org, team.slug, token);

    for (const repo of teamRepos) {
      let metadata = {};

      try {
        metadata = await fetchRepoMetadata(org, repo.name, token);
      } catch (err) {
        console.error(`Failed to fetch metadata for ${repo.name}:`, err);
      }

      reposWithTeams.push({
        ...repo,
        team: {
          name: team.name,
          slug: team.slug,
          members
        },
        metadata
      });
    }
  }

  // Deduplicate repositories (in case multiple teams have access)
  const uniqueRepos = Array.from(
    new Map(reposWithTeams.map(repo => [repo.full_name, repo])).values()
  );

  // Only keep repos that have repo_metadata.yml
  const reposWithMetadata = uniqueRepos.filter(
    repo => repo.metadata && Object.keys(repo.metadata).length > 0
  );

  // Fetch epics for those repositories
  const reposWithEpics = await fetchEpicsForRepositories(
    org,
    reposWithMetadata,
    token
  );

  return {
    org,
    teams,
    repos: reposWithEpics
  };
}