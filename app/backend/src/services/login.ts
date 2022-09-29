import validateBody from '../utils/validateBody';
import User from '../database/models/user';
import loginSchema from '../schemas/login';
import getToken from '../utils/getToken';
import StatusCodes from '../types/StatusCodes';
import decryptPassword from '../utils/decryptPassword';
import { LoginServiceResponse } from '../types/ServiceResponse';
import getTokenProperties from '../utils/getTokenProperties';

export default class LoginService {
  private _userModel = User;

  public async login(email: string, password: string): Promise<LoginServiceResponse> {
    validateBody(loginSchema, { email, password });

    const user = await this._userModel.findOne({ where: { email } });

    if (!user) return { code: StatusCodes.UNAUTHORIZED, error: 'Incorrect email or password' };

    await decryptPassword(user.password, password);

    const { id, username, password: passwordHash } = user;

    const token = getToken({ id, username, passwordHash, email });
    return { code: StatusCodes.OK, token };
  }

  public async validate(token: string | undefined): Promise<LoginServiceResponse> {
    if (!token) return { code: StatusCodes.NOT_FOUND, error: 'Token not found.' };

    const id = getTokenProperties(token);

    const user = await this._userModel.findOne({ where: { id } }) as User;

    const { role } = user;
    return { code: 200, data: role };
  }
}
