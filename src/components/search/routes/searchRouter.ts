import express from "express";
import search from "../controllers/searchController.js";
const router = express.Router();


router.get("/:search/athletes", search.showAthletesResults);
router.get("/:search/teams", search.showTeamsResults);
router.get("/:search/competitions", search.showCompetitionsResults);

router.get("/:search/athletes/name", search.showAthletesByNameResults);
router.get("/:search/teams/name", search.showTeamsByNameResults);
router.get("/:search/competitions/name", search.showCompetitionsByNameResults);

router.get("/:search/athletes/name/:order", search.showAthletesByNameResultsOrdered);
router.get("/:search/teams/name/:order", search.showTeamsByNameResultsOrdered);
router.get("/:search/competitions/name/:order", search.showCompetitionsByNameResultsOrdered);

router.get("/:search/athletes/:order", search.showAthletesResultsOrdered);
router.get("/:search/teams/:order", search.showTeamsResultsOrdered);
router.get("/:search/competitions/:order", search.showCompetitionsResultsOrdered);

router.get("/:search/:order", search.showAllResultsOrdered);
router.get("/:search", search.showResultsAll);


export default router;