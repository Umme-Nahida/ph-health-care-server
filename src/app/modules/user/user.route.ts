import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../helpers/fileUploader";
import { UserValidation } from "./user.validation";

const router = Router();

// define user routes here
router.post("/",
    fileUploader.upload.single('file'),
    (req:Request, res: Response, next: NextFunction)=> {
      req.body =  UserValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))
      return  userController.createPatient(req, res, next)
    }
    )
export const userRouter = router;