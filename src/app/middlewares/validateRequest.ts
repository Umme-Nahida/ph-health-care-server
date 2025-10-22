import { NextFunction, Request, Response } from 'express'
import {ZodError, ZodObject} from 'zod'

const validateRequest = (schema: ZodObject)=> async(req:Request, res: Response, next: NextFunction)=>{
    try{
      await schema.parseAsync({body:req.body})
      next()
    }catch(err){
        if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: (err as any).errors
        })
      }
        next(err)
    }
}

export default validateRequest;