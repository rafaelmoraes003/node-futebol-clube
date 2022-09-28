import validateBody from '../utils/validateBody';
import User from '../database/models/user';
import loginSchema from '../schemas/login';
import getToken from '../utils/getToken';
import StatusCodes from '../types/StatusCodes';
import decryptPassword from '../utils/decryptPassword';
import LoginServiceResponse from '../types/ServiceResponse';

export default class LoginService {
  private _userModel = User;

  public async login(email: string, password: string): Promise<LoginServiceResponse> {
    validateBody(loginSchema, { email, password });

    const user = await this._userModel.findOne({ where: { email } });

    if (!user) return { code: StatusCodes.NOT_FOUND, error: 'User not found.' };

    await decryptPassword(user.password, password);

    const { id, username } = user;

    const token = getToken({ id, username, password, email });
    return { code: StatusCodes.OK, token };
  }
}
