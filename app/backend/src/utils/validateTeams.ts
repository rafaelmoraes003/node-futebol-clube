import CustomError from '../types/CustomError';
import StatusCodes from '../types/StatusCodes';
import Team from '../database/models/team';

const validateTeams = async (teams: number[]): Promise<void> => {
  const count = await Team.findAll({ where: { id: teams } });
  if (count.length !== teams.length) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      'There is no team with such id!',
    );
  }
};

export default validateTeams;
