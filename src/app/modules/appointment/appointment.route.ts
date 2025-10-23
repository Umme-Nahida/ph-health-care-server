import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import authCookies from "../../middlewares/authCookies";
import { UserRole } from "@prisma/client";


const router = Router()

router.post("/", authCookies(UserRole.PATIENT), AppointmentController.createAppointment)


export const AppointmentRouter = router;