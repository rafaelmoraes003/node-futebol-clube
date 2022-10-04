import Match from '../database/models/match';
import Team from '../database/models/team';
import { ITeamStats } from '../types/interfaces';
import { stats, cleanStats, getStats } from './getStats';
import sortStats from './sortStats';

const getLeaderboardStats = (
  teams: Team[],
  matches: Match[],
  type: string,
) => teams.map(({ id, teamName }): ITeamStats => {
  cleanStats();
  matches.forEach(({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals }) => {
    const teamType = type === 'home' ? homeTeam : awayTeam;
    if (id === teamType) {
      stats.totalGames += 1;
      getStats(homeTeamGoals, awayTeamGoals, type);
    }
  });
  return { name: teamName, ...stats };
});

const getAllLeaderboardStats = (
  teams: Team[],
  matches: Match[],
) => teams.map(({ id, teamName }): ITeamStats => {
  cleanStats();
  matches.forEach(({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals }) => {
    if (id === homeTeam) {
      stats.totalGames += 1;
      getStats(homeTeamGoals, awayTeamGoals, 'home');
    } else if (id === awayTeam) {
      stats.totalGames += 1;
      getStats(homeTeamGoals, awayTeamGoals, 'away');
    }
  });
  return { name: teamName, ...stats };
});

const orderedLeaderboard = (
  teams: Team[],
  matches: Match[],
  type: string | undefined,
): ITeamStats[] => {
  const leaderboard = type
    ? getLeaderboardStats(teams, matches, type)
    : getAllLeaderboardStats(teams, matches);

  return leaderboard.sort(sortStats);
};

export default orderedLeaderboard;
