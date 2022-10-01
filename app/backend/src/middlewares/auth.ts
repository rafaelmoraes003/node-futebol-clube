import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import StatusCodes from '../types/StatusCodes';

dotenv.config();

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization: token } = req.headers;
  if (!token) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: 'Token not found.',
    });
  }
  try {
    jwt.verify(token, String(process.env.JWT_SECRET));
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Token must be a valid token',
    });
  }
};

export default auth;
