import express from "express";
import gamesController from "../../games/controllers/gamesController.js";
const router = express.Router();
router.get("/:id/stats", gamesController.playerStatisticInGame);
router.get("/", (req, res) => {
    gamesController.getAllGamesByDate(req, res, (result) => {
        res.send(result);
    });
});
router.post("/", gamesController.createGame);
router.put("/:id", gamesController.editGame);
router.delete("/:id", gamesController.deleteGame);
router.delete("/", gamesController.deleteAllGames);
export default router;
