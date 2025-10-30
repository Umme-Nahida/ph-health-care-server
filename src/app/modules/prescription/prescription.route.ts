
import express from "express";
import { PrescriptionController } from "./prescription.controller";
import authCookies from "../../middlewares/authCookies";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", authCookies(UserRole.DOCTOR), PrescriptionController.createPrescription)
router.get(
    '/my-prescription',
    authCookies(UserRole.PATIENT),
    PrescriptionController.patientPrescription
)


export const PrescriptionRouter = router;