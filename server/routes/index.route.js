import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';

const router = express.Router(); // eslint-disable-line new-cap

router.use('/user', userRoutes);

router.use('/auth', authRoutes);

export default router;
