import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes"
import { IsActive } from "../modules/user/user.interface";
import { verifyToken } from "../utills/jwt";
import { envVars } from "../config/env";


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(403, "No token received");
    }

    const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as JwtPayload;
    // console.log("✅ Decoded Token:", verifiedToken);
    // console.log("✅ Required Roles:", authRoles);

    

    const isUserExist = await User.findOne({ email: verifiedToken.email });

 

    if (!isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
    }

    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
      throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);
    }


    if (!authRoles.includes(verifiedToken.userRole)) {
      throw new AppError(403, "You are not permitted to view this route!!!");
    }
    

    req.user = verifiedToken;
    next();
  } catch (error) {
    console.log("❌ Auth error:", error);
    next(error);
  }
};
