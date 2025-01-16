import express from "express";
import user from "../controllers/userController.js";
import verifyJWT from "../../../common/middlewares/verifyJWT.js";
const router = express.Router();
router.post("/login", user.login);
router.post("/signUp", user.signUp);
router.post('/logout', verifyJWT, (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true });
    res.status(200).json({ message: 'Logged out successfully' });
});
export default router;
