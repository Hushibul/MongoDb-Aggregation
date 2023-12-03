import { Router } from 'express';
import {
  getAllUsers,
  getUserByAggregation,
} from '../controller/userController.js';

const router = Router();

router.get('/all', getAllUsers);

router.get('/agg', getUserByAggregation);

export default router;
