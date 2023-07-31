import { Router } from 'express';
import { verifyAdmin, verifyUser } from '../../midlewares/index.js';
import { createThumbnailUploader } from '../../helpers/uploader.js';
import path from 'path';

import * as products from './index.js';

const uploader = createThumbnailUploader(path.join(process.cwd(), 'public', 'images', 'thumbnails'));

const router = Router();

router.post('/products', verifyAdmin, uploader.fields([{ name: 'data' }, { name: 'file' }]), products.createProduct);
router.get('/products', verifyUser, products.getAllProducts);
router.get('/products/:id', verifyAdmin, products.getProductById);
router.patch(
  '/products/:id',
  verifyAdmin,
  uploader.fields([{ name: 'data' }, { name: 'file' }]),
  products.updateProduct
);
router.delete('/products/:id', verifyAdmin, products.deleteProduct);

export default router;
