import express from 'express';
// 👇 Ensure this path uses the lowercase 'userController' to match the filename
import { registerUser, loginUser } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;