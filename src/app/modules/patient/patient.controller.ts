import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJWTPayload } from "../../Types/types";
import sendResponse from "../../shared/sendResponse";
import { PatientService } from "./patient.service";



const getAllPatient = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {

    const user = req.user
    const result = await PatientService.getAllPatient(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true, 
        message: "Retrive all patient successfully!",
        data: result
    })
});



const updatePatientData = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {

    const user = req.user
    const result = await PatientService.updatePatientData(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true, 
        message: "update Patient Data successfully!",
        data: result
    })
});



const getSingleUser = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {

    const user = req.user
    const result = await PatientService.getSingleUser(user as IJWTPayload);

    sendResponse(res, {
        statusCode: 201,
        success: true, 
        message: "Get My profile Data successfully!",
        data: result
    })
});


export const PatientController = {
    getAllPatient,
    updatePatientData,
    getSingleUser
}
