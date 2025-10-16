import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { cleanRegex } from "zod/v4/core/util.cjs";



const createPatient = catchAsync(async (req:Request, res:Response)=>{
    // console.log("patient created", req)
    const result = await userService.createPatient(req)
    console.log("result from controller", result)

    sendResponse(res, {
        statusCode: 201,
        success:true,
        message: "Patient created successfully",
        data: result
    })
})


export const userController = {
    createPatient
}