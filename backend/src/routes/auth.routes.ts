import express from 'express';
import { login, register } from '../controllers/auth.controller';

const router = express.Router();
console.log("&&")
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route is!' });
})
router.post('/register', register);
router.post('/login', login);
export default router;
