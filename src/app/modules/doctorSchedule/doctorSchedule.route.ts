import express from "express";
import { doctorScheduleController } from "./doctorSchedule.controller";
import { UserRole } from "@prisma/client";
import authCookies from "../../middlewares/authCookies";
import validateRequest from "../../middlewares/validateRequest";
import { createDoctorScheduleValidator } from "./doctorSchedule.validator";

const router = express.Router();

router.post("/",
    authCookies(UserRole.DOCTOR),
    validateRequest(createDoctorScheduleValidator),
    doctorScheduleController.createDoctorSchedule)

export const doctorScheduleRoute = router;