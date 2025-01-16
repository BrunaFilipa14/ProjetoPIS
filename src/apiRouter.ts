import express from "express";
import teamsRouter from "./components/teams/routes/teamsRouter.js";
import competitionsRouter from "./components/competitions/routes/competitionsRouter.js";
import user from "./components/user/controllers/userController.js";
const router = express.Router();


router.post("/login", user.login);
router.post("/signUp", user.signUp);

router.use("/teams", teamsRouter);
// router.use("/athletes", athletesRouter);
router.use("/competitions", competitionsRouter);
// router.use("/games", gamesRouter);
// router.use("/statistics", staticticsRouter);

export default router;