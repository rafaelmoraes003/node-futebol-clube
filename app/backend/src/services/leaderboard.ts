import Team from '../database/models/team';
import Match from '../database/models/match';
import orderedLeaderboard from '../utils/getLeaderboard';
import StatusCodes from '../types/StatusCodes';
import { ServiceResponse } from '../types/ServiceResponse';
import { ITeamStats } from '../types/interfaces';

export default class LeaderboardService {
  private _matchModel = Match;
  private _teamModel = Team;

  public async getLeaderboard(type: string): Promise<ServiceResponse<ITeamStats[]>> {
    const teams = await this._teamModel.findAll();

    const matches = await this._matchModel.findAll({
      where: { inProgress: false },
    });

    const leaderboard = orderedLeaderboard(teams, matches, type);
    return { code: StatusCodes.OK, data: leaderboard };
  }
}
