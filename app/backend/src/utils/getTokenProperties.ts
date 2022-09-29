import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import CustomError from '../types/CustomError';
import StatusCodes from '../types/StatusCodes';
import { ITokenPayload } from './getToken';

dotenv.config();

const getTokenProperties = (token: string): number => {
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as ITokenPayload;
    return id;
  } catch (error) {
    throw new CustomError(StatusCodes.BAD_REQUEST, 'Invalid signature.');
  }
};

export default getTokenProperties;
