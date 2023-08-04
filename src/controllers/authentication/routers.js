import {Router} from 'express';
import {verifyAdmin, verifyUser} from '../../midlewares/index.js';
import path from 'path';

//@import controllers
import * as AuthControllers from './index.js';
import {createProfileUploader} from '../../helpers/uploader.js';

const uploader = createProfileUploader(path.join(process.cwd(), 'public', 'images', 'profiles'));


//@define route
const router = Router();

//@Authentication
router.post('/auth/login', AuthControllers.login);
router.get('/auth', AuthControllers.keepLogin);
router.patch('/auth/verify/', verifyUser, AuthControllers.verifyAccount);
router.patch('/auth/change-password', verifyUser, AuthControllers.changePassword);
router.put('/auth/forget-password', AuthControllers.forgetPassword);
router.patch('/auth/reset-password', AuthControllers.ressetPassword);
router.put('/auth/upload-image',
    uploader.fields([{name: 'data'}, {name: 'file'}]),
    verifyUser,
    AuthControllers.uploadImage);

export default router;
