import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJWTPayload } from "../../Types/types";
import sendResponse from "../../shared/sendResponse";
import { MetaService } from "./meta.service";


const getDashboardMeta = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {

    const user = req.user
    const result = await MetaService.getDashboardMeta(user as IJWTPayload);

    sendResponse(res, {
        statusCode: 201,
        success: true, 
        message: "Retrive all Dashboard meta successfully!",
        data: result
    })
});


export const MetaController = {
  getDashboardMeta
}
