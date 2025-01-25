import express from "express";
import statistics from "../controllers/statisticsController.js";
const router = express.Router();


router.get("/athletes", (req,res) => statistics.athleteStatistics(req, res, (result) => {
    res.send(result);
    })
);
router.get("/teams", (req,res) => statistics.teamStatistics(req, res, (result) => {
    res.send(result);
    })
);



export default router;