import { Router } from 'express';
import { verifyUser } from '../../midlewares/index.js';

//@import controllers
import * as AuthControllers from './index.js';

//@define route
const router = Router();

//@Authentication
router.post('/auth/login', AuthControllers.login);
router.get('/auth', AuthControllers.keepLogin);
router.get('/auth/verify/:token', AuthControllers.verifyAccount);
router.patch('/auth/change-default-password', verifyUser, AuthControllers.changeDefaultPassword);
router.put('/auth/forget-password', AuthControllers.forgetPassword);
router.patch('/auth/reset-password', AuthControllers.ressetPassword);

export default router;
