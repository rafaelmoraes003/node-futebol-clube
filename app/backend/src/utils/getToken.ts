import * as jwt from 'jsonwebtoken';

interface ITokenPayload {
  id: number,
  username: string,
  email: string,
  passwordHash: string,
}

const getToken = (payload: ITokenPayload): string => {
  const token = jwt.sign(payload, 'jwt_secret');
  return token;
};

export default getToken;
