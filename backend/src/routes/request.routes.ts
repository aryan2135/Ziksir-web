import express from 'express';
import { requestController } from '../controllers/request.controller';
import { upload } from '../middlewares/uploadMiddleware';

const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ message: 'Request route is working!' });
});

// Create request with file upload support
router.post('/', upload.single('image'), (req, res) => requestController.createRequest(req, res));

router.get('/', (req, res) => requestController.getRequests(req, res));
router.get('/:id', (req, res) => requestController.getRequestById(req, res));
router.put('/:id', upload.single('image'), (req, res) => requestController.updateRequest(req, res));
router.delete('/:id', (req, res) => requestController.deleteRequest(req, res));

export default router; 