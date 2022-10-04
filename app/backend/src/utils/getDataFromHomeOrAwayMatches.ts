import { IStatsProps } from '../types/interfaces';
import { getStats, stats } from './getStats';

const getDataFromHomeOrAwayMatches = (statsData: IStatsProps): void => {
  const { teamType, type, id, homeTeamGoals, awayTeamGoals } = statsData;
  if (id === teamType) {
    stats.totalGames += 1;
    getStats(homeTeamGoals, awayTeamGoals, type as string);
  }
};

export default getDataFromHomeOrAwayMatches;
