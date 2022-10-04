import { NextFunction, Request, Response } from 'express';
import StatusCodes from '../types/StatusCodes';
import LeaderboardService from '../services/leaderboard';

export default class LeaderboardController {
  private _leaderboardService = new LeaderboardService();

  public getHomeLeaderboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const leaderboard = await this._leaderboardService.getLeaderboard('home');
      return res.status(StatusCodes.OK).json(leaderboard);
    } catch (error) {
      next(error);
    }
  };
}
