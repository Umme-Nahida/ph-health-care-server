import { UserStatus } from "@prisma/client"
import { prisma } from "../../../config/db"
import bcrypt from "bcryptjs"
import Jwt  from "jsonwebtoken"
import { email } from "zod"
import { generateToken } from "../../helpers/jwtToken"


const login = async(payload: {email: string, password: string})=>{
    console.log(payload)
    const user = await prisma.user.findUniqueOrThrow({
        where: { email: payload.email, status:UserStatus.ACTIVE}
    })

    const isMatchPass = await bcrypt.compare(payload.password, user.password)

    if(!isMatchPass){
        throw new Error("password is incorrect")
    }

    const payloadJwt = {
        id: user.id,
        email: user.email,
        role: user.role
    }
    const accessToken = generateToken(payloadJwt, "secret", "1h")
    const refreshToken = generateToken(payloadJwt, 'secret', "90d")
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