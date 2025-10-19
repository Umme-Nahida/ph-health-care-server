import { Prisma } from "@prisma/client";
import { IJWTPayload } from "../../Types/types";
import { prisma } from "../../../config/db";


const createDoctorSchedule = async (user:IJWTPayload,payload:any) => {
   //don't checking is doctor exist in doctor table
  const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
   const doctorScheduleData = payload.scheduleIds.map((schedule: string) => ({
      doctorId: user.id,
      scheduleId: schedule
   }))


   return await prisma.doctorSchedules.createMany({
      data: doctorScheduleData
   })
}

export const DoctorScheduleService = {
   createDoctorSchedule
}