import express from "express";
const router = express.Router();
import favouritesController from "../controllers/favouritesController.js";


router.get("/teams", favouritesController.checkFavouriteTeams);
router.get("/athletes", favouritesController.checkFavouriteAthletes);


router.post("/team", favouritesController.addFavouriteTeam);
router.post("/athlete", favouritesController.addFavouriteAthlete);


router.delete("/team", favouritesController.removeFavouriteTeam);
router.delete("/athlete", favouritesController.removeFavouriteAthlete);



export default router;