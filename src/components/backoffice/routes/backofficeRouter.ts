import express from "express";
const router = express.Router();
import backofficeController from "../controllers/backofficeController.js";
import teamsController from "../../teams/controllers/teamsController.js";
import teamsRouter from "../../teams/routes/teamsRouter.js"

router.get("/",  backofficeController.showBackoffice);
    

export default router;