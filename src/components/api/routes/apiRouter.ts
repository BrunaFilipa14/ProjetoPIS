import express from "express";
import teamsRouter from "../../teams/routes/teamsRouter.js";
import competitionsRouter from "../../competitions/routes/competitionsRouter.js";
import favouritesRouter from "../../favourites/routes/favouritesRouter.js";
import user from "../../user/controllers/userController.js";
const router = express.Router();


router.post("/login", user.login);
router.post("/signUp", user.signUp);

router.use("/teams", teamsRouter);
// router.use("/athletes", athletesRouter);
router.use("/competitions", competitionsRouter);
// router.use("/games", gamesRouter);
// router.use("/statistics", staticticsRouter);
router.use("/favourite", favouritesRouter);

export default router;