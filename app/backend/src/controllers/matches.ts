import { NextFunction, Request, Response } from 'express';
import MatchesService from '../services/matches';

export default class MatchesController {
  private _matchesService = new MatchesService();

  public getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, data } = await this._matchesService.getAll();
      return res.status(code).json(data);
    } catch (error) {
      next(error);
    }
  };
}
