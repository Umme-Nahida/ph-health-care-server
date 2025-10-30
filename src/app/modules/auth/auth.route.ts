import { Router } from "express";
import { authController } from "./auth.controller";
import authCookies from "../../middlewares/authCookies";
import { UserRole } from "@prisma/client";


const router = Router();

// define Auth routes here
router.post("/login",authController.login)
router.get(
    "/me",
    authController.getMe
)

router.post(
    "/login",
    authController.login
)

router.post(
    '/refresh-token',
    authController.refreshToken
)

router.post(
    '/change-password',
    authCookies(
        UserRole.ADMIN,
        UserRole.DOCTOR,
        UserRole.PATIENT
    ),
    authController.changePassword
);

router.post(
    '/forgot-password',
    authController.forgotPassword
);

router.post(
    '/reset-password',
    authController.resetPassword
)

export const authRouter = router;