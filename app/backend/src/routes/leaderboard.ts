import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboard';

const leaderboard = Router();

const leaderboardController = new LeaderboardController();

leaderboard.get('/', leaderboardController.getLeaderboard);

leaderboard.get('/home', leaderboardController.getHomeLeaderboard);

leaderboard.get('/away', leaderboardController.getAwayLeaderboard);

export default leaderboard;
