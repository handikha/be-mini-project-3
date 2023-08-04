import { Router } from 'express';
import {
  createTransaction,
  getTransaction,
  getTransactions,
  payTransaction,
  updateTransaction,
  validate,
  getTransactionsForAdmin,
} from './index.js';
import { verifyUser, verifyAdmin } from '../../midlewares/index.js';

const router = Router();

router.post('/transaction', verifyUser, validate('createTransaction'), createTransaction);
router.get('/transaction', verifyUser, getTransactions);
router.get('/transaction/:id', verifyUser, getTransaction);
router.put('/transaction/:id', verifyUser, validate('updateTransaction'), updateTransaction);
router.post('/transaction/pay', verifyUser, validate('payTransaction'), payTransaction);
router.get('/transactions', getTransactionsForAdmin);
export default router;
