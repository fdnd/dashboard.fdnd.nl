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

  const teams = await fetchOrgTeams(org, token);

  if (!teams || teams.length === 0) {
    return {
      org,
      teams: [],
      repos: []
    };
  }

  // Haal per team parallel members + repos op
  const reposWithTeamsNested = await Promise.all(
    teams.map(async (team) => {
      const [members, teamRepos] = await Promise.all([
        fetchTeamMembers(org, team.slug, token),
        fetchTeamRepos(org, team.slug, token)
      ]);

      // Teams zonder members overslaan
      if (!members || members.length === 0 || !teamRepos || teamRepos.length === 0) {
        return [];
      }

      // Per repo metadata parallel ophalen
      const reposWithMeta = await Promise.all(
        teamRepos.map(async (repo) => {
          let metadata = {};
          try {
            metadata = await fetchRepoMetadata(org, repo.name, token);
          } catch (err) {
            console.error(`Failed to fetch metadata for ${repo.name}:`, err);
          }

          return {
            ...repo,
            team: {
              name: team.name,
              slug: team.slug,
              members
            },
            metadata
          };
        })
      );

      return reposWithMeta;
    })
  );

  // Geneste arrays vlak maken
  const reposWithTeams = reposWithTeamsNested.flat();

  // Deduplicatie (bij meerdere teams met toegang tot dezelfde repo)
  const uniqueRepos = Array.from(
    new Map(reposWithTeams.map((repo) => [repo.full_name, repo])).values()
  );

  // Alleen repos met repo_metadata.yml
  const reposWithMetadata = uniqueRepos.filter(
    (repo) => repo.metadata && Object.keys(repo.metadata).length > 0
  );

  // Epics ophalen (idealiter intern ook met Promise.all geïmplementeerd)
  const reposWithEpics = await fetchEpicsForRepositories(org, reposWithMetadata, token);

  return {
    org,
    teams,
    repos: reposWithEpics
  };
}