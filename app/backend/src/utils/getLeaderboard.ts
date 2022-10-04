import Match from '../database/models/match';
import Team from '../database/models/team';
import { ITeamStats } from '../types/interfaces';
import getDataFromAllMatches from './getDataFromAllMatches';
import getDataFromHomeOrAwayMatches from './getDataFromHomeOrAwayMatches';
import { stats, cleanStats } from './getStats';
import sortStats from './sortStats';

const getLeaderboard = (
  teams: Team[],
  matches: Match[],
  type: string,
) => teams.map(({ id, teamName }): ITeamStats => {
  cleanStats();
  matches.forEach(({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals }) => {
    if (type === 'all') {
      getDataFromAllMatches({ id, homeTeam, awayTeam, homeTeamGoals, awayTeamGoals });
    } else {
      const teamType = type === 'home' ? homeTeam : awayTeam;
      getDataFromHomeOrAwayMatches({ teamType, type, id, homeTeamGoals, awayTeamGoals });
    }
  });
  return { name: teamName, ...stats };
});

const orderedLeaderboard = (
  teams: Team[],
  matches: Match[],
  type: string,
): ITeamStats[] => {
  const leaderboard = getLeaderboard(teams, matches, type);
  return leaderboard.sort(sortStats);
};

export default orderedLeaderboard;
