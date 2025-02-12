import admin from 'firebase-admin';
import {applicationDefault, initializeApp} from 'firebase-admin/app';
import asyncHandler from "express-async-handler";
import {NextFunction, Request, Response} from "express";
import {getAuth} from "firebase-admin/auth";
import {UnauthorizedException} from "../exceptions/http.exceptions";

initializeApp({
    credential: admin.credential.cert("./fitbit-clone-firebase-adminsdk.json")
});

export const authenticateUser = asyncHandler(async (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Unauthorized: Missing or invalid token.');
    }

    const idToken = authHeader.split(' ')[1];

    try {
        await getAuth().verifyIdToken(idToken);

        next();
    } catch (error) {
        throw new UnauthorizedException('Unauthorized: Invalid or expired token.');
    }
});
