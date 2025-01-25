import express from "express";
const router = express.Router();
import competitionsController from "../controllers/competitionsController.js";
router.get("/:name", (req, res) => competitionsController.getCompetitionByName(req, res, (result) => {
    res.send(result);
}));
//router.get("/:name/teams", competitionsController.getCompetitionTeams);
router.get("/:compId/players", competitionsController.getCompetitionGames);
router.get("/", (req, res) => {
    competitionsController.getAllCompetitions(req, res, (result) => {
        res.send(result);
    });
});
router.post("/", competitionsController.createCompetition); //TODO verifications
router.put("/:id", competitionsController.editCompetition); //TODO verifications
router.delete("/:id", competitionsController.deleteCompetition);
router.delete("/", competitionsController.deleteAllCompetitions);
export default router;
