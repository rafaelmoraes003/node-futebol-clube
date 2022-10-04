import Team from '../database/models/team';
import Match from '../database/models/match';
import orderedLeaderboard from '../utils/getLeaderboard';

export default class LeaderboardService {
  private _matchModel = Match;
  private _teamModel = Team;

  public async getLeaderboard(type: string) {
    const teams = await this._teamModel.findAll();

    const matches = await this._matchModel.findAll({
      where: { inProgress: false },
    });

    return orderedLeaderboard(teams, matches, type);
  }
}
