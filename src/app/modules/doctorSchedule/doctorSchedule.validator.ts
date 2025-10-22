import z from "zod";

export const createDoctorScheduleValidator = z.object({
    body: z.object({
        scheduleIds: z.array(z.string())
    })
})