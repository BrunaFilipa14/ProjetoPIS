const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController.js");

router.get("/:name", teamsController.getTeamByName); //TODO fetch
router.get("/", teamsController.getAllTeams);

router.post("/", teamsController.createTeam); //TODO verifications

router.put("/:id", teamsController.editTeam); //TODO verifications

router.delete("/:id", teamsController.deleteTeam); //TODO
router.delete("/", teamsController.deleteAllTeams); //TODO fetch

module.exports = router;