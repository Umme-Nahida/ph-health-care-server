import { Prisma } from "@prisma/client";
import { IJWTPayload } from "../../Types/types";
import { prisma } from "../../../config/db";
import AppError from "../../customizeErr/AppError";
import { constructNow } from "date-fns";


const createDoctorSchedule = async (user:IJWTPayload,payload:any) => {
   //don't checking is doctor exist in doctor table
  const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    
   const doctorScheduleData = payload.scheduleIds.map((schedule: string) => ({
      doctorId: doctorData.id,
      scheduleId: schedule
   }))


   return await prisma.doctorSchedules.createMany({
      data: doctorScheduleData
   })

}

// get doctor schedule by id
const getDoctorScheduleById = async(user:IJWTPayload, id: string)=>{
   console.log("user", user)
   const isExistDoctor = await prisma.doctor.findUnique({where: {email: user.email}})

   if(!isExistDoctor){
      throw new AppError(403, "Doctor is not found")
   }

   const result = await prisma.doctorSchedules.findMany({
      where: {
         doctorId: id
      }
   })

   return result
}

export const DoctorScheduleService = {
   createDoctorSchedule,
   getDoctorScheduleById
}