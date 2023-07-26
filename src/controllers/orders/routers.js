import { Router } from 'express';
import { getOrders, createOrder, deleteOrder, updateOrder, validate, payOrder, getOrderById } from './index.js';
import { verifyUser } from '../../midlewares/index.js';

const router = Router();

router.get('/order', verifyUser, getOrders);
router.get('/order/:id', verifyUser, getOrderById);
router.post('/order', verifyUser, ...validate('createOrder'), createOrder);
router.put('/order/:id', verifyUser, updateOrder);
router.delete('/order/:id', verifyUser, deleteOrder);
router.patch('/order/:id', verifyUser, payOrder);

export default router;
