import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import config from '../../config/config';
import controller from '../controllers/user.controller';

const router = express.Router();

router.route('/auth-url')
  .get(controller.getAuthUrl);

router.route('/code')
  .post(controller.exchangeCode);

router.route('/me').get(expressJwt({ secret: config.jwtSecret }), controller.me);

router.route('/playlist-id')
  .get(controller.getPlaylistId);

router.route('/create-playlist')
  .post(controller.createPlaylist);

export default router;
