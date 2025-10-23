import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helpers/pick";



const createPatient = catchAsync(async (req:Request, res:Response)=>{
    // console.log("patient created", req.body)
    const result = await userService.createPatient(req)

    sendResponse(res, {
        statusCode: 201,
        success:true,
        message: "Patient created successfully",
        data: result
    })
})


const createAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.createAdmin(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    // console.log("doctor controller req", req.body)
    const result = await userService.createDoctor(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Created successfuly!",
        data: result
    })
});


const getAllUser = catchAsync(async (req:Request, res:Response)=>{
    // pasination, sorting and filtering,searching
    const filters = pick(req.query, ['searchTerm', 'role', 'status', 'email'])
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])
    // const {page, limit, searchTerm, sortBy, sortOrder} = req.query;
    // console.log("patient created", req)
     const result = await userService.getAllUser(filters, options)

    sendResponse(res, {
        statusCode: 200,
        success:true,
        message: "All users retrieve successfully",
        meta: result.meta,
        data: result.data
    })
})







export const userController = {
    createPatient,
    getAllUser,
    createAdmin,
    createDoctor
}