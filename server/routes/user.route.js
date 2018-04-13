import express from 'express';
import validate from 'express-validation';
import controller from '../controllers/user.controller';

const router = express.Router();

router.route('/auth-url')
  .get(controller.getAuthUrl);

router.route('/code')
  .post(controller.exchangeCode);

router.route('/authenticate')
  .post(controller.authenticateUser);

router.route('/playlist-id')
  .get(controller.getPlaylistId);

router.route('/create-playlist')
  .post(controller.createPlaylist);

export default router;
