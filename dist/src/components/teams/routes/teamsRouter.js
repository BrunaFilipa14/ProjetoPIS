import express from "express";
const router = express.Router();
import teamsController from "../controllers/teamsController.js";
router.get("/:name", (req, res) => teamsController.getTeamByName(req, res, (result) => {
    res.send(result);
}));
router.get("/:name/players", teamsController.getTeamPlayers);
router.get("/", (req, res) => {
    teamsController.getAllTeams(req, res, (result) => {
        res.send(result);
    });
});
router.post("/", teamsController.createTeam); //TODO verifications
router.put("/:id", teamsController.editTeam); //TODO verifications
router.delete("/:id", teamsController.deleteTeam);
router.delete("/", teamsController.deleteAllTeams);
export default router;
