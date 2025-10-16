import { Request } from "express"
import { prisma } from "../../../config/db"
import bcrypt from 'bcryptjs'
import { fileUploader } from "../../helpers/fileUploader"
import { cleanRegex } from "zod/v4/core/util.cjs"

const createPatient = async(payload:Request)=>{
  // console.log("payload", payload.body)
  const isUserExist = await prisma.user.findUnique({where: {email: payload.body.patient.email}})

  if(isUserExist){
    throw new Error("User already exist")
  }


  // upload file to cloudinary 
  if(payload.file){
    const uploads = await fileUploader.uploadToCloudinary(payload.file)
    payload.body.patient.profilePhoto = uploads!.secure_url as string
    // console.log("uploads", uploads)
    // console.log("payload after upload",payload.body)
  }
  
  const hashPassword = await bcrypt.hash(payload.body.password, 10)

  const result = await prisma.$transaction(async(tnx)=>{

    await tnx.user.create({
        data: {
            email: payload.body.patient.email,
            password: hashPassword
        }
    })

   return await tnx.patient.create({
        data: payload.body.patient
    })
  })

  console.log("result from service", result)
  return result;

}

export const userService = {
    createPatient
}