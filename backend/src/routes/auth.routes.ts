import express from 'express';
import {authController} from '../controllers/auth.controller';

const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ message: 'Auth route is working!' });
});

router.post('/signup', authController.signup);
router.post('/login', authController.login);
export default router;
