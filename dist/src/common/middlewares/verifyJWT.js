import jwt from "jsonwebtoken";
const SIGN_KEY = process.env.SIGN_KEY || "password";
function verifyJWT(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/sign_in");
    }
    jwt.verify(token, SIGN_KEY, function (err, decoded) {
        if (err) {
            return res.redirect("/sign_in");
        }
        if (decoded && typeof decoded !== 'string') {
            req.userId = decoded.id;
            next();
        }
        else {
            res.status(401).json({ auth: false, message: 'Failed to decode token.' });
            return;
        }
    });
}
export default verifyJWT;
