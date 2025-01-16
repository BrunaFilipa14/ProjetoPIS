import express from "express";
import search from "../controllers/searchController.js";
const router = express.Router();
router.get("/:search", search.getResultsAthletes);
router.get("/teams/:search", search.getResultsTeams);
router.get("/competitions/:search", search.getResultsCompetitions);
export default router;
