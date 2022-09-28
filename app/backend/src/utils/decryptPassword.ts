import * as bcrypt from 'bcryptjs';
import CustomError from '../types/CustomError';
import StatusCodes from '../types/StatusCodes';

const decryptPassword = async (hash: string, password: string): Promise<void> => {
  const checkPassword = await bcrypt.compare(password, hash);
  if (!checkPassword) {
    throw new CustomError(
      StatusCodes.UNAUTHORIZED,
      'Unauthorized user',
    );
  }
};

export default decryptPassword;
