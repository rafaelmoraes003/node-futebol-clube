import * as jwt from 'jsonwebtoken';
import CustomError from '../types/CustomError';
import StatusCodes from '../types/StatusCodes';
import { ITokenPayload } from './getToken';

const getTokenProperties = (token: string): number => {
  try {
    const { id } = jwt.verify(token, String(process.env.JWT_SECRET)) as ITokenPayload;
    return id;
  } catch (error) {
    throw new CustomError(StatusCodes.BAD_REQUEST, 'Invalid signature.');
  }
};

export default getTokenProperties;
