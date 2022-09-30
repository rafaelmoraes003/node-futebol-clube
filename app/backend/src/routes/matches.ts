import { Router } from 'express';
import MatchesController from '../controllers/matches';

const matches = Router();

const matchesController = new MatchesController();

matches.get('/', matchesController.getAll);

export default matches;
