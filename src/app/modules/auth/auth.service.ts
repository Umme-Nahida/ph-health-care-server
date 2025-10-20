import { UserStatus } from "@prisma/client"
import { prisma } from "../../../config/db"
import bcrypt from "bcryptjs"
import { generateToken } from "../../helpers/jwtToken"
import config from "../../../config"
import AppError from "../../customizeErr/AppError"
import httpStatus  from "http-status"


const login = async(payload: {email: string, password: string})=>{
    console.log(payload)
    const user = await prisma.user.findUniqueOrThrow({
        where: { email: payload.email, status:UserStatus.ACTIVE}
    })

    const isMatchPass = await bcrypt.compare(payload.password, user.password)

    if(!isMatchPass){
        throw new AppError(httpStatus.BAD_REQUEST, "password is incorrect")
    }

    const payloadJwt = {
        id: user.id,
        email: user.email,
        role: user.role
    }
    const accessToken = generateToken(payloadJwt, config.jwt_secret as string, config.jwt_expire_in as string)
    const refreshToken = generateToken(payloadJwt, config.jwt_refresh_secret as string, config.jwt_refresh_expire_in as string)
    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange,
        user: user
    }
}

export const authService = {
    login
}