import { AppointmentStatus, PaymentStatus, Prescription, UserRole } from "@prisma/client"
import { IJWTPayload } from "../../Types/types"
import { prisma } from "../../../config/db"
import AppError from "../../customizeErr/AppError"

const createPrescription = async(user:IJWTPayload, payload:Partial<Prescription>)=>{
    console.log("prescription")
   
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
       where: {
          id: payload.appointmentId,
          status: AppointmentStatus.COMPLETED,
          paymentStatus: PaymentStatus.PAID
       },
       include:{
        doctor:true
       }    
    }) 

      if(user.role === UserRole.DOCTOR){
        if(!(user.email === appointmentData.doctor.email)){
            throw new AppError(403, "This is not your appointment")
        }
    }

   const result = await prisma.prescription.create({
     data:{
        appointmentId: payload.appointmentId as string,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        instructions: payload.instructions as string,
        followUpDate: payload.followUpDate || null
     },
     include: {
        patient: true
     }
   })

   return result

}


export const PrescriptionService = {
    createPrescription
}