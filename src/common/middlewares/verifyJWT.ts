import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string;  // Add the userId property to the Request type
        }
    }
}

function verifyJWT(req :Request, res:Response, next:NextFunction): void{
    const token = req.headers['x-access-token'] as string | undefined;
    if (!token){
        res.status(401).json({ auth: false, message: 'No token provided.' });
        return;
    }

    jwt.verify(token, 'palavrasecreta', function(err, decoded) {
        if (err){
            res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
            return;
        }

        if (decoded  && typeof decoded !== 'string') {
            req.userId = decoded.id;
            console.log("funcionou");
            next();
        } else {
            res.status(401).json({ auth: false, message: 'Failed to decode token.' });
            return;
        }
    });
}

export default verifyJWT;
    