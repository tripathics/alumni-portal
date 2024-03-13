import { Router } from 'express';

import userRoutes from './users/users.js';
import otpRoutes from './otp/otp.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/otp', otpRoutes);

export default router;
