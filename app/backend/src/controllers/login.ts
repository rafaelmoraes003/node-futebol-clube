import { NextFunction, Request, Response } from 'express';
import LoginService from '../services/login';

export default class LoginController {
  private _loginService = new LoginService();

  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const { code, error, token } = await this._loginService.login(email, password);
      if (error) {
        return res.status(code).json({ message: error });
      }
      return res.status(code).json({ token });
    } catch (error) {
      next(error);
    }
  };

  public validate = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization: token } = req.headers;
    try {
      const { code, error, data } = await this._loginService.validate(token);
      if (error) return res.status(code).json({ message: error });
      return res.status(code).json({ role: data });
    } catch (error) {
      next(error);
    }
  };
}
