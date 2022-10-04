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

const orderedLeaderboard = (teams: Team[], matches: Match[], type: string): ITeamStats[] => {
  const leaderboard = getLeaderboardStats(teams, matches, type);
  return leaderboard.sort((a: ITeamStats, b: ITeamStats) => {
    if (a.totalPoints > b.totalPoints) return -1;
    if (a.totalPoints < b.totalPoints) return 1;

    if (a.goalsBalance > b.goalsBalance) return -1;
    if (a.goalsBalance < b.goalsBalance) return 1;

    if (a.goalsFavor > b.goalsFavor) return -1;
    if (a.goalsFavor < b.goalsFavor) return 1;

    if (a.goalsOwn < b.goalsOwn) return -1;
    if (a.goalsOwn > b.goalsOwn) return 1;

    return 0;
  });
};

export default orderedLeaderboard;
