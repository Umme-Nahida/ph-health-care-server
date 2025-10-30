import { AppointmentStatus, PaymentStatus, Prescription, UserRole } from "@prisma/client"
import { IJWTPayload } from "../../Types/types"
import { prisma } from "../../../config/db"
import AppError from "../../customizeErr/AppError"
import { calcultatepagination, Ioptions } from "../../helpers/paginationHelper"

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


const patientPrescription = async (user: IJWTPayload, options: Ioptions) => {
    const { limit, page, skip, sortBy, sortOrder } = calcultatepagination(options);

    const result = await prisma.prescription.findMany({
        where: {
            patient: {
                email: user.email
            }
        },
        skip,
        take: limit,
        include: {
            doctor: true,
            patient: true,
            appointment: true
        }
    })

    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user.email
            }
        }
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }

};




export const PrescriptionService = {
    createPrescription,
    patientPrescription
}