import express from "express";
import gamesController from "../../games/controllers/gamesController.js";
const router = express.Router();
router.get("/:id/statistics", gamesController.playerStatisticInGame);
export default router;
