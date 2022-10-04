import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboard';

const leaderboard = Router();

const leaderboardController = new LeaderboardController();

leaderboard.get('/home', leaderboardController.getHomeLeaderboard);

export default leaderboard;
