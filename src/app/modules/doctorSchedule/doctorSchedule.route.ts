import express from "express";
import { doctorScheduleController } from "./doctorSchedule.controller";
import { UserRole } from "@prisma/client";
import authCookies from "../../middlewares/authCookies";

const router = express.Router();

router.post("/",
    authCookies(UserRole.DOCTOR),
    doctorScheduleController.createDoctorSchedule)

export const doctorScheduleRoute = router;