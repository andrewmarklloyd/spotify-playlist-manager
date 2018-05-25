import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import config from '../../config/config';
import controller from '../controllers/user.controller';

const router = express.Router();

router.use(expressJwt({ secret: config.jwtSecret }));

router.route('/me').get(controller.me);

router.route('/profile').get(controller.profile);

export default router;
