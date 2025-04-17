import express from 'express';
import { getProducts } from '../controllers/merchController.js';

const router = express.Router();

router.get('/products', getProducts);

export default router;