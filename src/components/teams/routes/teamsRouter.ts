const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController.js");
import multer from 'multer';
const uploadTeamBadge = multer({dest: './../../../public/images/teams/'});

router.get("/:name", teamsController.getTeamByName);
router.get("/:name/players", teamsController.getTeamPlayers); // TODO get it working
router.get("/", teamsController.getAllTeams);

router.post("/", uploadTeamBadge.single('teamBadge'), teamsController.createTeam); //TODO verifications

router.put("/:id", uploadTeamBadge.single('teamBadge'), teamsController.editTeam); //TODO verifications

router.delete("/:id", teamsController.deleteTeam);
router.delete("/", teamsController.deleteAllTeams);

export default router;