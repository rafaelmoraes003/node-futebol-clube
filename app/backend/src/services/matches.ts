import StatusCodes from '../types/StatusCodes';
import Match from '../database/models/match';
import { ServiceResponse } from '../types/ServiceResponse';
import { IMatch, IGoals } from '../types/interfaces';
import validateBody from '../utils/validateBody';
import { matchSchema, updateMatchResultSchema } from '../schemas/matches';
import validateTeams from '../utils/validateTeams';
import getMatches from '../utils/getMatches';

export default class MatchesService {
  private _matchesModel = Match;

  public static async getAll(inProgress: string | undefined): Promise<ServiceResponse<Match[]>> {
    const matches = await getMatches(inProgress);
    return { code: StatusCodes.OK, data: matches };
  }

  public async create(match: IMatch): Promise<ServiceResponse<IMatch>> {
    validateBody(matchSchema, match);
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = match;

    if (inProgress === false) { // Pode ser undefined mas não pode ser false
      return {
        code: StatusCodes.BAD_REQUEST, error: 'InProgress must be true.',
      };
    }

    await validateTeams([homeTeam, awayTeam]);

    const { id } = await this._matchesModel.create({
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    });
    return { code: StatusCodes.CREATED, data: { id, ...match, inProgress: true } };
  }

  public async getById(id: number): Promise<ServiceResponse<Match>> {
    const match = await this._matchesModel.findByPk(id);
    if (!match) return { code: StatusCodes.NOT_FOUND, error: 'Match not found.' };
    return { code: StatusCodes.OK, data: match };
  }

  public async finishMatch(id: number): Promise<ServiceResponse<string>> {
    const { error, code } = await this.getById(id);
    if (error) return { code, error };

    await this._matchesModel.update({ inProgress: false }, { where: { id } });
    return { code: StatusCodes.OK, data: 'Finished' };
  }

  public async updateMatch(id: number, goals: IGoals): Promise<ServiceResponse<string>> {
    validateBody(updateMatchResultSchema, goals);
    const { homeTeamGoals, awayTeamGoals } = goals;

    const { error, code } = await this.getById(id);
    if (error) return { code, error };

    await this._matchesModel.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );

    return { code: StatusCodes.OK, data: 'Match results updated!' };
  }
}
