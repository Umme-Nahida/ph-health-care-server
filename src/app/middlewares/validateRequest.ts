import { NextFunction, Request, Response } from 'express'
import {ZodObject} from 'zod'

const validateRequest = (schema: ZodObject)=> (req:Request, res: Response, next: NextFunction)=>{
    try{
        schema.parseAsync({body:req.body})
    }catch(err){
        next(err)
    }
}

export default validateRequest;