import Match from '../database/models/match';
import Team from '../database/models/team';
import { ITeamStats } from '../types/interfaces';
import { stats, cleanStats, getStats } from './getStats';

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

export default getLeaderboardStats;
