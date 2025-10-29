
import { Review } from "@prisma/client"
import { IJWTPayload } from "../../Types/types"
import { prisma } from "../../../config/db"
import AppError from "../../customizeErr/AppError"
import httpStatus from "http-status"

const getAllPatient = async(user:IJWTPayload, payload:Partial<Review>)=>{
   
    //  const isExistAdmin = await prisma.patient.findUnique({
    //     where: {
    //         id: user.id
    //     }
    //  })

    //  if(!isExistAdmin){
    //      throw new AppError(httpStatus.BAD_REQUEST, "You have no permission to access this route")
    //  }

     const result = await prisma.patient.findMany()
     return result

}


const getSingleUser = async(user:IJWTPayload)=>{
   
    //  const isExistAdmin = await prisma.patient.findUnique({
    //     where: {
    //         id: user.id
    //     }
    //  })

    //  if(!isExistAdmin){
    //      throw new AppError(httpStatus.BAD_REQUEST, "You have no permission to access this route")
    //  }

     const result = await prisma.user.findUnique({
          where: {
               email: user.email
          },
          include:{
               patient:true
          }
     })
     return result

}

const updatePatientData = async(user:IJWTPayload, payload:any)=>{

 const {medicalReport, patientHealthData, ...rest} = payload;

 const patient = await prisma.patient.findUniqueOrThrow({
     where:{
          email: user.email,
          isDeleted:false
     }
 })

 await prisma.$transaction(async(tnx)=>{
     await tnx.patient.update({
          where: {
               id: patient.id
          },
          data: rest
     })
 })

}

export const PatientService = {
     getAllPatient,
     updatePatientData,
     getSingleUser
}