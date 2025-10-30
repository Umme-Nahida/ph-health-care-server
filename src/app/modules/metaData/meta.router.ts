import { Router } from "express";
import authCookies from "../../middlewares/authCookies";
import { UserRole } from "@prisma/client";
import { MetaController } from "./meta.controller";

const router = Router() 


router.get("/", authCookies(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), MetaController.getDashboardMeta)


export const MetaRouter = router;
