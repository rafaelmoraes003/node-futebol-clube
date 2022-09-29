import { Router } from 'express';
import TeamsController from '../controllers/teams';

const teams = Router();

const teamsController = new TeamsController();

teams.get('/', teamsController.getAll);
teams.get('/:id', teamsController.getById);

export default teams;
