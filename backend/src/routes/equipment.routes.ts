import express from "express";
import { equipmentController } from "../controllers/equipment.controller";

const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ message: 'Equipment route is working!' });
})

router.get("/", (req, res) => equipmentController.getAllEquipment(req, res));
router.post("/", (req, res) => equipmentController.createEquipment(req, res));
router.get("/:id", (req, res) => equipmentController.getEquipmentById(req, res));
router.put("/:id", (req, res) => equipmentController.updateEquipment(req, res));
router.delete("/:id", (req, res) => equipmentController.deleteEquipment(req, res));

export default router;