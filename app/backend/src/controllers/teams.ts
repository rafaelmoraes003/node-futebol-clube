import { NextFunction, Request, Response } from 'express';
import TeamsService from '../services/teams';

export default class TeamsController {
  private _teamsService = new TeamsService();

  public getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, data } = await this._teamsService.getAll();
      return res.status(code).json(data);
    } catch (error) {
      next(error);
    }
  };
}
