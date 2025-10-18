import express from "express";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post("/",ScheduleController.insertIntoDB)
router.get("/get-all-schedule",ScheduleController.schedulesForDoctor)

export const ScheduleRoutes = router;