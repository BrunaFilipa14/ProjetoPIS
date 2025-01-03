const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController.js");


router.get("/:name", teamsController.getTeamByName);
router.get("/:name/players", teamsController.getTeamPlayers);
router.get("/", teamsController.getAllTeams);

router.post("/", teamsController.createTeam); //TODO verifications

router.put("/:id", teamsController.editTeam); //TODO verifications

router.delete("/:id", teamsController.deleteTeam);
router.delete("/", teamsController.deleteAllTeams);

export default router;