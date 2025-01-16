import viewsController from "../controllers/viewsController.js";
import express from "express";
const router = express.Router();
router.get("/teams", viewsController.showAllTeams);
router.get("/teams/:name", viewsController.showTeam);
router.get("/competitions", viewsController.showAllCompetitions);
export default router;
