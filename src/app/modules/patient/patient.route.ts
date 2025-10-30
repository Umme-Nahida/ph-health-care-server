import { Router } from "express";
import { PatientController } from "./patient.controller";
import authCookies from "../../middlewares/authCookies";
import { UserRole } from "@prisma/client";


const router = Router()


router.get("/",PatientController.getAllPatient)
router.get("/me",authCookies(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), PatientController.getSingleUser)
router.patch("/", authCookies(UserRole.PATIENT), PatientController.updatePatientData)


export const PatientRouter = router;