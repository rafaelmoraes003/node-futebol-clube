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

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = req.body;
    try {
      const { code, data, error } = await this._matchesService.create({
        homeTeam,
        awayTeam,
        homeTeamGoals,
        awayTeamGoals,
        inProgress,
      });
      if (error) return res.status(code).json({ message: error });
      return res.status(code).json(data);
    } catch (error) {
      next(error);
    }
  };

  public finishMatch = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const { code, data, error } = await this._matchesService.finishMatch(Number(id));
      if (error) return res.status(code).json({ message: error });
      return res.status(code).json({ message: data });
    } catch (error) {
      next(error);
    }
  };
}
