import express, { Router } from 'express';
import { extractPrice } from './extract-price';

const router: Router = express.Router();

router.post('/extract-price', extractPrice);

export default router;
