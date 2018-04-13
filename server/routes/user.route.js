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

export default router;
