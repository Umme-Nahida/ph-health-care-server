import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../Types/types";
import { pick } from "../../helpers/pick";


const createAppointment = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    console.log("user",user)
    const result = await AppointmentService.createAppointment(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Appointment created successfully!",
        data: result
    })
});


const myAppointment = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    console.log("req", user)
    const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"])
    const fillters = pick(req.query, ["status", "paymentStatus"])

    const result = await AppointmentService.myAppointment(user as IJWTPayload, fillters, options);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "My appointment retrieve successfully!",
        data: result
    })
});

export const AppointmentController = {
    createAppointment,
    myAppointment
}