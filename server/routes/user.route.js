import express from 'express';
import validate from 'express-validation';
import controller from '../controllers/user.controller';

const router = express.Router();

router.route('/auth-url')
  .get(controller.authUrl);

router.route('/code')
  .post(controller.getAccessCode);

export default router;
