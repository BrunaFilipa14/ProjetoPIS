const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController.js");

router.get("/:name", teamsController.getTeamByName); //TODO fetch
router.get("/", teamsController.getAllTeams); //TODO fetch

router.post("/", teamsController.createTeam); //TODO fetch + verifications

router.put("/:id", teamsController.editTeam); //TODO fetch + verifications

// router.delete("/:id", teamsController); //TODO
// router.delete("/", teamsController); //TODO

module.exports = router;