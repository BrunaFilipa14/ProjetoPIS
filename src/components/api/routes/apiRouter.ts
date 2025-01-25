import express from "express";
import teamsRouter from "../../teams/routes/teamsRouter.js";
import competitionsRouter from "../../competitions/routes/competitionsRouter.js";
import gamesRouter from "../../games/routes/gamesRouter.js";
import favouritesRouter from "../../favourites/routes/favouritesRouter.js";
import athletesRouter from "../../athletes/routes/athletesRouter.js";
import statisticsRouter from "../../statistics/routes/statisticsRouter.js";
import user from "../../user/controllers/userController.js";
import searchRouter from "../../search/routes/searchRouter.js";
const router = express.Router();


router.post("/login", user.login);
router.post("/signUp", user.signUp);

router.use("/teams", teamsRouter);
router.use("/athletes", athletesRouter);
router.use("/competitions", competitionsRouter);
router.use("/games", gamesRouter);
router.use("/statistics", statisticsRouter);
router.use("/favourite", favouritesRouter);
router.use("/search", searchRouter)

export default router;