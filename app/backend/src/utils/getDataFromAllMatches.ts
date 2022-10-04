import { IStatsProps } from '../types/interfaces';
import { getStats, stats } from './getStats';

const getDataFromAllMatches = (statsData: IStatsProps): void => {
  const { id, homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = statsData;
  if (id === homeTeam) {
    stats.totalGames += 1;
    getStats(homeTeamGoals, awayTeamGoals, 'home');
  } else if (id === awayTeam) {
    stats.totalGames += 1;
    getStats(homeTeamGoals, awayTeamGoals, 'away');
  }
};

export default getDataFromAllMatches;
