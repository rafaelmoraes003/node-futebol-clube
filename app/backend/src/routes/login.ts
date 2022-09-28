import { Router } from 'express';
import LoginController from '../controllers/login';

const login = Router();

const loginController = new LoginController();

login.post('/', loginController.login);

export default login;
