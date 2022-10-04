import Match from '../database/models/match';
import Team from '../database/models/team';

const getMatches = async (inProgress: undefined | string): Promise<Match[]> => {
  const matches = await Match.findAll({
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

  return matches;
};

export default getMatches;
