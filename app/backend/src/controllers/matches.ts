import { NextFunction, Request, Response } from 'express';
import MatchesService from '../services/matches';

export default class MatchesController {
  private _matchesService = new MatchesService();

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    const { inProgress } = req.query;
    try {
      const { code, data } = await this._matchesService.getAll(inProgress as (string | undefined));
      return res.status(code).json(data);
    } catch (error) {
      next(error);
    }
  };
}
