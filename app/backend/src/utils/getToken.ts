import * as jwt from 'jsonwebtoken';

export interface ITokenPayload {
  id: number,
  username: string,
  email: string,
  passwordHash: string,
}

const getToken = (payload: ITokenPayload): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string);
  return token;
};

export default getToken;
