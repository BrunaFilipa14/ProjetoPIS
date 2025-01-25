import express from "express";
import gamesController from "../../games/controllers/gamesController.js";
const router = express.Router();


router.get("/:id/stats", gamesController.playerStatisticInGame);

router.put("/:id", gamesController.editGame);



export default router;