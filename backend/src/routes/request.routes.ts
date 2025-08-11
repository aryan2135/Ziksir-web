import express from 'express';
import { requestController } from '../controllers/request.controller';

const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ message: 'Request route is working!' });
}
);

router.post('/', (req, res) => requestController.createRequest(req, res));
router.get('/', (req, res) => requestController.getRequests(req, res));
router.get('/:id', (req, res) => requestController.getRequestById(req, res));
router.put('/:id', (req, res) => requestController.updateRequest(req, res));
router.delete('/:id', (req, res) => requestController.deleteRequest(req, res));

export default router;