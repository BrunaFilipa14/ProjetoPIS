const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController.js");

// router.get("/:id", teamsController.allTeams); //TO DO
router.get("/", teamsController.allTeams); //TO DO

// router.post("/", teamsController); //TO DO

// router.put("/:id", teamsController); //TO DO

// router.delete("/:id", teamsController); //TO DO
// router.delete("/", teamsController); //TO DO

module.exports = router;