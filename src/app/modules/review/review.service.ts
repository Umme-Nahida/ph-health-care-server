import { Review } from "@prisma/client"
import { IJWTPayload } from "../../Types/types"
import { prisma } from "../../../config/db"
import AppError from "../../customizeErr/AppError"
import htttpStatus from "http-status"


const createReview = async(user:IJWTPayload, payload:Partial<Review>)=>{
    console.log("review", payload)
    console.log("user", user)
   
    const patientData = await prisma.patient.findUnique({
        where: {
            email: user.email
        }
    })

    if(!patientData){
        throw new AppError(htttpStatus.BAD_REQUEST, "this patient was not found")
    }

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId
        }
    })


    if(!(patientData.id === appointmentData.patientId)){
        throw new AppError(htttpStatus.BAD_REQUEST, "This is not your appointment")
    }


   return await prisma.$transaction(async(tnx)=>{


       const result = await tnx.review.create({
        data:{
            appointmentId:appointmentData.id,
            patientId: appointmentData.patientId,
            doctorId: appointmentData.doctorId,
            rating: payload.rating as number,
            comment: payload.comment
        }
    })

    const avgRating = await tnx.review.aggregate({
        _avg:{
            rating:true
        },
        where:{
            doctorId: appointmentData.doctorId
        }
    })

    await tnx.doctor.update({
        where: {
            id: appointmentData.doctorId
        },
        data: {
            averageRating: avgRating._avg.rating as number
        }
    })

    return result;

   })


   
   
  

 

}


export const ReviewService = {
     createReview
}