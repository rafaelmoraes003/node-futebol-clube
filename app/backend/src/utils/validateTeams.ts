import CustomError from '../types/CustomError';
import StatusCodes from '../types/StatusCodes';
import Team from '../database/models/team';

const validateTeams = async (teams: number[]): Promise<void> => {
  if (teams[0] === teams[1]) {
    throw new CustomError(
      StatusCodes.UNAUTHORIZED,
      'It is not possible to create a match with two equal teams',
    );
  }

  const { count } = await Team.findAndCountAll({ where: { id: teams } });
  if (count !== teams.length) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      'There is no team with such id!',
    );
  }
};

export default validateTeams;
