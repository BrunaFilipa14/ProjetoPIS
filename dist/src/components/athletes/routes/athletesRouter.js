import express from "express";
const router = express.Router();
import teamsController from "../controllers/athletesController.js";
router.get("/:name", (req, res) => teamsController.getAthleteByName(req, res, (result) => {
    res.send(result);
}));
router.get("/", (req, res) => {
    teamsController.getAllAthletes(req, res, (result) => {
        res.send(result);
    });
});
router.post("/", teamsController.createAthlete); //TODO verifications
router.put("/:id", teamsController.editAthlete); //TODO verifications
router.delete("/:id", teamsController.deleteAthlete);
router.delete("/", teamsController.deleteAllAthletes);
export default router;
