import StatusCodes from '../types/StatusCodes';
import Team from '../database/models/team';
import { TeamsServiceResponse } from '../types/ServiceResponse';

export default class TeamsService {
  private _teamsModel = Team;

  public async getAll(): Promise<TeamsServiceResponse<Team[]>> {
    const teams = await this._teamsModel.findAll();
    return { code: StatusCodes.OK, data: teams };
  }

  public async getById(id: number): Promise<TeamsServiceResponse<Team>> {
    const team = await this._teamsModel.findOne({ where: { id } });
    if (!team) return { code: StatusCodes.NOT_FOUND, error: 'Not found.' };
    return { code: StatusCodes.OK, data: team };
  }
}
