import z, { email } from "zod";


const createPatientValidationSchema = z.object({
    password: z.string({error: "Password is required"}).min(6, " Password must be at least 6 characters long"),
    patient: z.object({
        name: z.string().nonempty({error: "name is required"}),
        email: z.string().nonempty({error: "email is required"}),
        address: z.string().optional()
    })
})


export const UserValidation = {
    createPatientValidationSchema
}