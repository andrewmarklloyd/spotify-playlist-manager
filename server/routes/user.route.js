import express from 'express';
import validate from 'express-validation';
import controller from '../controllers/user.controller';

const router = express.Router();

router.route('/auth-url')
  .get(controller.authUrl);

router.route('/code')
  .post(controller.getAccessCode);

router.route('/register')
  .post(controller.registerUser);

router.route('/login')
  .post(controller.loginUser);

export default router;
