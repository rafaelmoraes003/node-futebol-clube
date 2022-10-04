import { NextFunction, Request, Response } from 'express';
import LeaderboardService from '../services/leaderboard';

export default class LeaderboardController {
  private _leaderboardService = new LeaderboardService();

  public getHomeLeaderboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, data } = await this._leaderboardService.getLeaderboard('home');
      return res.status(code).json(data);
    } catch (error) {
      next(error);
    }
  };

  public getAwayLeaderboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, data } = await this._leaderboardService.getLeaderboard('away');
      return res.status(code).json(data);
    } catch (error) {
      next(error);
    }
  };

  public getLeaderboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, data } = await this._leaderboardService.getLeaderboard(undefined);
      return res.status(code).json(data);
    } catch (error) {
      next(error);
    }
  };
}
