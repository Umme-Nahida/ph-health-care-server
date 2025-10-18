import { addHours, addMinutes, addYears, format } from "date-fns";
import { prisma } from "../../../config/db";
import { Prisma } from "@prisma/client";
import { gte } from "zod";
import { calcultatepagination } from "../../helpers/paginationHelper";

const insertIntoDB = async (payload: any) => {

    const { startTime, endTime, startDate, endDate } = payload;
    const intervalTime = 30; //30 minutes
    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {

        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(":")[0]) //11:00
                ),
                Number(startTime.split(":")[1])
            )
        )


        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(":")[0]) //11:00
                ),
                Number(endTime.split(":")[1])
            )
        )
        console.log("ISO Date:", startDate, endDate)
        console.log("Full ISO Date:", currentDate, lastDate)
        console.log("startDateTime & endDateTime", startDateTime, endDateTime)


        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime; //10:00
            const slotEndDateTime = addMinutes(startDateTime, intervalTime) //10:30


            const scheduleData = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime,
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: scheduleData
            })

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                })

                schedules.push(result);
            }


            // update startDateTime for next slot, that means 10:30
            slotStartDateTime.setMinutes(slotEndDateTime.getMinutes() + intervalTime);
        }
        // move to next day and start next day schedule
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedules;
}


const schedulesForDoctor = async (filters: any, options: any) => {
    //logic will be added later
    console.log("filters and options", filters, options)
    const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime } = filters;
    const { page, limit, sortBy, sortOrder } = calcultatepagination(options)


    const pageNumber = page || 1;
    const limitNumber = limit || 5;

    const skip = (pageNumber - 1) * limitNumber;
    const andConditions: Prisma.ScheduleWhereInput[] = [];

    if (filterStartDateTime && filterEndDateTime) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: new Date(filterStartDateTime as string)
                    }
                },
                {
                    endDateTime: {
                        lte: new Date(filterEndDateTime as string)
                    }
                }
            ]
        })
    }

    const whereCondition: Prisma.ScheduleWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const schedules = await prisma.schedule.findMany({
        where: whereCondition,
        skip,
        take: limitNumber,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" }
    })


    const total = await prisma.schedule.count({
        where: whereCondition
    })
    return {
        meta: {
            page,
            limit,
            total
        },
        data: schedules
    }

}


export const ScheduleService = {
    insertIntoDB,
    schedulesForDoctor
}