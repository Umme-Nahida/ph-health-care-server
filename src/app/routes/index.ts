import express from 'express';
import { userRouter } from '../modules/user/user.route';
import { authRouter } from '../modules/auth/auth.route';
import { ScheduleRoutes } from '../modules/schedule/schedule.route';
import { doctorScheduleRoute } from '../modules/doctorSchedule/doctorSchedule.route';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.route';
import { DoctorRoutes } from '../modules/doctor/doctor.route';
import { AppointmentRouter } from '../modules/appointment/appointment.route';
import { PrescriptionRouter } from '../modules/prescription/prescription.route';
import { ReviewRouter } from '../modules/review/review.route';
import { PatientRouter } from '../modules/patient/patient.route';
import { MetaRouter } from '../modules/metaData/meta.router';


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
    },
      {
        path: '/specialties',
        route: SpecialtiesRoutes
    },
      {
        path: '/doctor',
        route: DoctorRoutes
    },
      {
        path: '/appointment',
        route: AppointmentRouter
    },
      {
        path: '/prescription',
        route: PrescriptionRouter
    },
      {
        path: '/review',
        route: ReviewRouter
    },
      {
        path: '/patient',
        route: PatientRouter
    },
      {
        path: '/meta',
        route: MetaRouter
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;