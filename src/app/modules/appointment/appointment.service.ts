import { APIConnectionError } from "openai";
import { prisma } from "../../../config/db";
import { IJWTPayload } from "../../Types/types";
import { v4 as uuidv4 } from 'uuid';
import { stripe } from "../../helpers/stripe";
import { calcultatepagination, Ioptions } from "../../helpers/paginationHelper";
import { AppointmentStatus, Prisma, UserRole } from "@prisma/client";
import { tuple } from "zod";
import AppError from "../../customizeErr/AppError";

const createAppointment = async (user: IJWTPayload, payload: { doctorId: string, scheduleId: string }) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false
        }
    });

    const isBookedOrNot = await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    })

    const videoCallingId = uuidv4();


    const result = await prisma.$transaction(async (tnx) => {
        const appointmentData = await tnx.appointment.create({
            data: {
                doctorId: doctorData.id,
                patientId: patientData.id,
                scheduleId: payload.scheduleId,
                videoCallingId
            }
        })

        await tnx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked:true
            }
        })


        const transactionId = uuidv4();

       const paymentData = await tnx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        })

        // return appointmentData


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: `Appointment with ${doctorData.name}`,
                        },
                        unit_amount: doctorData.appointmentFee * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                appointmentId: appointmentData.id,
                paymentId: paymentData.id
            },
            success_url: `https://www.programming-hero.com/`,
            cancel_url: `https://next.programming-hero.com/`,
        });
        
        return { 
            paymentData,
            paymentUrl: session.url 
        };
    })


  return result

};


const myAppointment = async (user: IJWTPayload, filters: any, options: Ioptions) => {
    const { page, limit, skip, sortBy, sortOrder } = calcultatepagination(options);
    const { ...filterData } = filters;

    console.log("my_Appointmnet_User", user)
    const andConditions: Prisma.AppointmentWhereInput[] = [];

    if (user.role === UserRole.PATIENT) {
        andConditions.push({
            patient: {
                email: user.email
            }
        })
    }
    else if (user.role === UserRole.DOCTOR) {
        andConditions.push({
            doctor: {
                email: user.email
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))

        andConditions.push(...filterConditions)
    }

    const whereConditions: Prisma.AppointmentWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        include: user.role === UserRole.DOCTOR ?
            { patient: true } : { doctor: true }
    });

    const total = await prisma.appointment.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            limit,
            page
        },
        data: result
    }

}


const updateAppointmentStatus = async(appointmentId:string, status: AppointmentStatus, user:any)=>{
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where:{
            id: appointmentId
        },
        include:{
            doctor:true,
            patient:true
        }
    })

    if(user.role === UserRole.DOCTOR){
        if(!(user.email === appointmentData.doctor.email)){
            throw new AppError(403, "This is not your appointment")
        }
    }

    const result = await prisma.appointment.update({
        where: {
            id:appointmentId
        },
        data: {
            status
        }
    });

    return result;

}

export const AppointmentService = {
    createAppointment,
    myAppointment,
    updateAppointmentStatus
};