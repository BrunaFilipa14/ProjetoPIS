import express from "express";
import user from "../controllers/userController.js";
import { verify } from "jsonwebtoken";
import verifyJWT from "../../../common/middlewares/verifyJWT.js";
import cookieParser from "cookie-parser";
const router = express.Router();


router.post("/login", user.login);
router.post("/signUp", user.signUp);
router.post('/logout', verifyJWT, (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true });
    res.status(200).json({ message: 'Logged out successfully' });
});

export default router;