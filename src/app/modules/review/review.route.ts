import { Router } from "express";
import { ReviewController } from "./review.controller";
import authCookies from "../../middlewares/authCookies";
import { UserRole } from "@prisma/client";

const router = Router()

router.post("/", authCookies(UserRole.PATIENT), ReviewController.createReview)


export const ReviewRouter = router;