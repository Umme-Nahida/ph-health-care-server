import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJWTPayload } from "../../Types/types";
import sendResponse from "../../shared/sendResponse";
import { ReviewService } from "./review.service";



const createReview = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {

    const user = req.user
    const result = await ReviewService.createReview(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Prescription created successfully!",
        data: result
    })
});


export const ReviewController = {
    createReview
}
