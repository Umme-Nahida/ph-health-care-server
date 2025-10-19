import express from 'express';
import { userRouter } from '../modules/user/user.route';
import { authRouter } from '../modules/auth/auth.route';
import { ScheduleRoutes } from '../modules/schedule/schedule.route';
import { doctorScheduleRoute } from '../modules/doctorSchedule/doctorSchedule.route';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: authRouter
    },
    {
        path: '/users',
        route: userRouter
    },
    {
        path: '/schedule',
        route: ScheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRoute
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;