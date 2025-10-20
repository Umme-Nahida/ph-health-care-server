import z from "zod";

export const createDoctorScheduleValidator = z.object({
    body: z.object({
        schduleId: z.array(z.string())
    })
})