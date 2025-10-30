import { Request } from "express"
import { prisma } from "../../../config/db"
import bcrypt from 'bcryptjs'
import { fileUploader } from "../../helpers/fileUploader"
import { calcultatepagination } from "../../helpers/paginationHelper"
import { searchTermsFields } from "../../helpers/searchTerms"
import { Admin, Doctor, Prisma, UserRole, UserStatus } from "@prisma/client"
import { IJWTPayload } from "../../Types/types"

const createPatient = async (payload: Request) => {
  // console.log("payload", payload.body)
  const isUserExist = await prisma.user.findUnique({ where: { email: payload.body.patient.email } })

  if (isUserExist) {
    throw new Error("User already exist")
  }


  // upload file to cloudinary 
  if (payload.file) {
    const uploads = await fileUploader.uploadToCloudinary(payload.file)
    payload.body.patient.profilePhoto = uploads!.secure_url as string;
  }

  const hashPassword = await bcrypt.hash(payload.body.password, 10)

  const result = await prisma.$transaction(async (tnx) => {

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

  // console.log("result from service", result)
  return result;

}

const createAdmin = async (req: Request): Promise<Admin> => {

    const file = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 10)

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });

        return createdAdminData;
    });

    return result;
};


// Doctor creattion service
const createDoctor = async (req: Request): Promise<Doctor> => {

    const file = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url
    }
    const hashedPassword: string = await bcrypt.hash(req.body.password, 10)

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        });

        return createdDoctorData;
    });

    return result;
};




const getAllUser = async (filters:any, options:any) => {

  const { page, limit, sortBy, sortOrder } = calcultatepagination(options)
  const { searchTerm, ...filtersData } = filters;

  const andConditions:Prisma.UserWhereInput[] = []

  if (searchTerm) {
    andConditions.push({
      OR: searchTermsFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' }
      }))
    })
  }


  if(Object.keys(filtersData).length){
    andConditions.push({
      AND: Object.keys(filtersData).map(key=>({[key]: {equals: filtersData[key]}}))
    })
  }
  const pageNumber = page || 1;
  const limitNumber = limit || 5;
  const search = searchTerm || "";
  // console.log("sortyBy", sortBy)
  // console.log("sortyBy", sortOrder)

  const skip = (pageNumber - 1) * limitNumber;

 const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

  const users = await prisma.user.findMany({
    skip: skip, take: limitNumber,
    where: whereConditions,
    orderBy: { [sortBy]: sortOrder }
  })

  const total = await prisma.user.count({
     where: whereConditions
  })
  return {
    meta: {
      page,
      limit,
      total
    },
    data: users
  }
}


const getMeInfo = async(user: IJWTPayload)=>{
  
  // console.log("user ", user)
  const userInfo = await prisma.user.findUnique({
    where:{
       email: user.email,
       status: UserStatus.ACTIVE
    }
  })

  let profileData 
  if(userInfo?.role === UserRole.ADMIN){
     profileData = await prisma.admin.findUnique({
        where: {
           email: user.email
        }
      })
  }

 else if(userInfo?.role === UserRole.DOCTOR){
    profileData = await prisma.doctor.findUnique({
        where: {
           email: user.email
        }
      })
  }

 else if(userInfo?.role === UserRole.PATIENT){
      profileData= await prisma.patient.findUnique({
        where: {
           email: user.email
        }
      })
  }

  return {
    ...userInfo,
    ...profileData
  }
}



// change profile status by admin------------ (INCOMPLETED)
const changeProfileStatus = async(id:string, status:{status: UserStatus})=>{
  console.log("changeProfile:", status) // INACTIVE 
  const userProfile = await prisma.user.findUniqueOrThrow({
    where: {id}
  })


  const updateUserStatus = await prisma.user.update({
    where: {id},
    data: {status:status}
  })

  return updateUserStatus
}

export const userService = {
  createPatient,
  getAllUser, 
  createAdmin,
  createDoctor,
  getMeInfo,
  changeProfileStatus
}