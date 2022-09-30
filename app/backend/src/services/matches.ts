import StatusCodes from '../types/StatusCodes';
import Match from '../database/models/match';
import Team from '../database/models/team';
import { ServiceResponse } from '../types/ServiceResponse';
import IMatch from '../types/interfaces';
import validateBody from '../utils/validateBody';
import matchSchema from '../schemas/matches';
import validateTeams from '../utils/validateTeams';

export default class MatchesService {
  private _matchesModel = Match;

  public async getAll(inProgress: string | undefined): Promise<ServiceResponse<Match[]>> {
    const matches = await this._matchesModel.findAll({
      ...(inProgress && { where: { inProgress: JSON.parse(inProgress) } }),
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

  public async create(match: IMatch): Promise<ServiceResponse<IMatch>> {
    validateBody(matchSchema, match);
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = match;

    if (!inProgress) return { code: StatusCodes.BAD_REQUEST, error: 'InProgress must be true.' };

    await validateTeams([homeTeam, awayTeam]);

    const { id } = await this._matchesModel.create({
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress,
    });
    return { code: StatusCodes.CREATED, data: { id, ...match } };
  }

  public async getById(id: number): Promise<ServiceResponse<Match>> {
    const match = await this._matchesModel.findOne({ where: { id } });
    if (!match) return { code: StatusCodes.NOT_FOUND, error: 'Match not found.' };
    return { code: StatusCodes.OK, data: match };
  }
}
