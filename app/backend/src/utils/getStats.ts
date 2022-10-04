export const stats = {
  totalPoints: 0,
  totalGames: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 0,
  goalsOwn: 0,
  goalsBalance: 0,
  efficiency: '0',
};

export const getStats = (homeTeamGoals: number, awayTeamGoals: number, type: string): void => {
  const victoryCondition = type === 'home'
    ? homeTeamGoals > awayTeamGoals
    : awayTeamGoals > homeTeamGoals;

  if (victoryCondition) {
    stats.totalVictories += 1;
    stats.totalPoints += 3;
  } else if (homeTeamGoals === awayTeamGoals) {
    stats.totalDraws += 1;
    stats.totalPoints += 1;
  } else {
    stats.totalLosses += 1;
  }
  stats.goalsFavor += type === 'home' ? homeTeamGoals : awayTeamGoals;
  stats.goalsOwn += type === 'home' ? awayTeamGoals : homeTeamGoals;
  stats.goalsBalance = stats.goalsFavor - stats.goalsOwn;
  stats.efficiency = ((stats.totalPoints / (stats.totalGames * 3)) * 100).toFixed(2);
};

export default getStats;
