import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../helpers/jwtToken";
import config from "../../config";
import httpStatus from "http-status"
import AppError from "../customizeErr/AppError";

const authCookies = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            // console.log("req cookies",req.cookies)
            const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
            

            if (!token) {
                throw new AppError(httpStatus.UNAUTHORIZED,"you don't have a token!")
            }

            const verifyUser = verifyToken(token, config.jwt_secret as string);

            req.user = verifyUser;

            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new AppError(httpStatus.UNAUTHORIZED,"You are not authorized!")
            }

            next();
        }
        catch (err) {
            next(err)
        }
    }
}

export default authCookies;