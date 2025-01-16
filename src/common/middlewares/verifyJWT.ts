import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import cookieParser from "cookie-parser";
const SIGN_KEY = process.env.SIGN_KEY || "password";


declare global {
    namespace Express {
        interface Request {
            userId?: string;  // Add the userId property to the Request type
        }
    }
}

function verifyJWT(req :Request, res:Response, next:NextFunction): void{
    const token = req.cookies.token;
    
    if (!token){
        return res.redirect("/sign_in");
    }

    jwt.verify(token, SIGN_KEY, function(err:any, decoded:any) {
        if (err){
            return res.redirect("/sign_in");
        }

        if (decoded  && typeof decoded !== 'string') {
            req.userId = decoded.id;
            next();
        } else {
            res.status(401).json({ auth: false, message: 'Failed to decode token.' });
            return;
        }
    });
}

export default verifyJWT;
    