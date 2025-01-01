"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController.js");
const multer_1 = __importDefault(require("multer"));
const uploadTeamBadge = (0, multer_1.default)({ dest: './../../../public/images/teams/' });
router.get("/:name", teamsController.getTeamByName);
router.get("/:name/players", teamsController.getTeamPlayers); // TODO get it working
router.get("/", teamsController.getAllTeams);
router.post("/", uploadTeamBadge.single('teamBadge'), teamsController.createTeam); //TODO verifications
router.put("/:id", uploadTeamBadge.single('teamBadge'), teamsController.editTeam); //TODO verifications
router.delete("/:id", teamsController.deleteTeam);
router.delete("/", teamsController.deleteAllTeams);
exports.default = router;
