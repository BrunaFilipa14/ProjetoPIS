import viewsController from "./components/views/controllers/viewsController.js";
import express from "express";
const router = express.Router();
router.get("/teams", viewsController.showAllTeams);
router.get("/teams/:name", viewsController.showTeam);
export default router;
