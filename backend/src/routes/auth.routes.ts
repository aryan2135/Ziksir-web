import express from 'express';
import { login, register } from '../controllers/auth.controller';

const router = express.Router();
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route is working!' });
})
router.post('/register', register);
router.post('/login', login);
export default router;
