import { Router } from 'express';
import auth from '../middlewares/auth';
import MatchesController from '../controllers/matches';

const matches = Router();

const matchesController = new MatchesController();

matches.get('/', matchesController.getAll);

matches.post('/', auth, matchesController.create);

export default matches;
