import { Router } from 'express';
import TeamsController from '../controllers/teams';

const teams = Router();

const teamsController = new TeamsController();

teams.get('/', teamsController.getAll);

export default teams;
