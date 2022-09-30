import StatusCodes from '../types/StatusCodes';
import Match from '../database/models/match';
import Team from '../database/models/team';
import { ServiceResponse } from '../types/ServiceResponse';

export default class MatchesService {
  private _matchesModel = Match;

  public async getAll(): Promise<ServiceResponse<Match[]>> {
    const matches = await this._matchesModel.findAll({
      include: [
        {
          model: Team,
          as: 'teamHome',
          attributes: { exclude: ['id'] },
        },
        {
          model: Team,
          as: 'teamAway',
          attributes: { exclude: ['id'] },
        },
      ],
    });
    return { code: StatusCodes.OK, data: matches };
  }
}
