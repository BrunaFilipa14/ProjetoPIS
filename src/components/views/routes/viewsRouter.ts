import viewsController from "../controllers/viewsController.js";
import express from "express";
const router = express.Router();


router.get("/index", viewsController.showIndex);

router.get("/favourites", viewsController.showFavourites);

router.get("/teams", viewsController.showAllTeams);
router.get("/teams/:name", viewsController.showTeam);

router.get("/competitions", viewsController.showAllCompetitions);
router.get("/competitions/:name", viewsController.showCompetition);

router.get("/athletes", viewsController.showAllAthletes);
router.get("/athletes/:name", viewsController.showAthlete);




export default router;
