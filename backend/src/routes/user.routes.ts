import express from 'express';
import {authController} from '../controllers/user.controller';

const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ message: 'Auth route is working!' });
});

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/count', authController.getTotalUserCount);
router.get('/', authController.getAllUsers);
router.get('/:id', authController.getUserById);
router.put('/:id', authController.updateUser);
router.delete('/:id', authController.deleteUser);
router.post('/:id/change-password', authController.changePassword);
export default router;
