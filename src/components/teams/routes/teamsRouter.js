const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController.js");

router.get("/:name", teamsController.getTeamByName); //TO DO
router.get("/", teamsController.getAllTeams); //TO DO

// router.post("/", teamsController.createTeam); //TO DO

// router.put("/:id", teamsController); //TO DO

// router.delete("/:id", teamsController); //TO DO
// router.delete("/", teamsController); //TO DO

module.exports = router;