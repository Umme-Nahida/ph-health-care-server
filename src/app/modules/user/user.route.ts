import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../helpers/fileUploader";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/authCookies";
import { UserRole } from "@prisma/client";
import authCookies from "../../middlewares/authCookies";

const router = Router();

// define user routes here
router.get("/", userController.getAllUser)
router.patch("/:id/status", userController.changeProfileStatus)

router.get("/me", authCookies(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), userController.getMeInfo)

router.post("/",
    fileUploader.upload.single('file'),
    (req:Request, res: Response, next: NextFunction)=> {
      req.body =  UserValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))
      return  userController.createPatient(req, res, next)
    }
    )

router.post(
    "/create-admin",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data))
        return userController.createAdmin(req, res, next)
    }
);

router.post(
    "/create-doctor",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        console.log(JSON.parse(req.body.data))
        req.body = UserValidation.createDoctorValidationSchema.parse(JSON.parse(req.body.data))
        return userController.createDoctor(req, res, next)
    }
);
export const userRouter = router;