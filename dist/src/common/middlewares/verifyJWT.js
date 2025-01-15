import jwt from "jsonwebtoken";
function verifyJWT(req, res, next) {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
        res.status(401).json({ auth: false, message: 'No token provided.' });
        return;
    }
    jwt.verify(token, 'palavrasecreta', function (err, decoded) {
        if (err) {
            res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
            return;
        }
        if (decoded && typeof decoded !== 'string') {
            req.userId = decoded.id;
            console.log("funcionou");
            next();
        }
        else {
            res.status(401).json({ auth: false, message: 'Failed to decode token.' });
            return;
        }
    });
}
export default verifyJWT;
