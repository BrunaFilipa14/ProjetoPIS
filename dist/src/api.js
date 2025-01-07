import express from "express";
import teamsRouter from "./components/teams/routes/teamsRouter.js";
import user from "./components/user/controllers/userController.js";
const router = express.Router();
router.post("/login", user.login);
router.post("signUp", user.signUp);
router.get("/index", (req, res) => {
    res.render("index");
});
router.use("/teams", teamsRouter);
// router.use("/athletes", verifyJWT, athletesRouter);
// router.use("/competitions", verifyJWT, competitionsRouter);
// router.use("/games", verifyJWT, gamesRouter);
// router.use("/statistics", verifyJWT, staticticsRouter);
export default router;
