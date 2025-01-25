import express from "express";
const router = express.Router();
import backofficeController from "../controllers/backofficeController.js";
router.get("/", backofficeController.showBackoffice);
export default router;
