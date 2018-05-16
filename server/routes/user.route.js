import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import config from '../../config/config';
import controller from '../controllers/user.controller';

const router = express.Router();

router.route('/me').get(expressJwt({ secret: config.jwtSecret }), controller.me);

export default router;
