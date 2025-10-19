import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import { pick } from "../../helpers/pick";


const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule created successfully!",
        data: result
    })
});


const schedulesForDoctor = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['startDateTime', 'endDateTime'])
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])

    const result = await ScheduleService.schedulesForDoctor(filters, options);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule Retrieve successfully!",
        data: result
    })
})

const schedulesDelete = catchAsync(async (req: Request, res: Response) => {

    const result = await ScheduleService.schedulesDelete(req.params.id);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule has been Deleted successfully!",
        data: result
    })
})



export const ScheduleController = {
    insertIntoDB,
    schedulesForDoctor,
    schedulesDelete
}