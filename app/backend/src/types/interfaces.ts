export interface IMatch {
  id?: number,
  homeTeam: number,
  awayTeam: number,
  homeTeamGoals: number,
  awayTeamGoals: number,
  inProgress: boolean,
}

export interface IGoals {
  homeTeamGoals: number,
  awayTeamGoals: number,
}

export interface ITeamStats {
  name?: string,
  totalGames: number,
  totalPoints: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: string,
}

export interface IStatsProps {
  id: number,
  homeTeam?: number,
  awayTeam?: number,
  homeTeamGoals: number,
  awayTeamGoals: number,
  teamType?: number,
  type?: string,
}
