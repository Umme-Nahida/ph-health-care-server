
import express from "express";
import { PrescriptionController } from "./prescription.controller";
import authCookies from "../../middlewares/authCookies";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", authCookies(UserRole.DOCTOR), PrescriptionController.createPrescription)


export const PrescriptionRouter = router;