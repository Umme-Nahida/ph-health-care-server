import { PaymentStatus, UserRole } from "@prisma/client";
import { IJWTPayload } from "../../Types/types"
import AppError from "../../customizeErr/AppError";
import { prisma } from "../../../config/db";


const getDashboardMeta = async (user: IJWTPayload) => {

    let metaData;

    switch (user.role) {
        case UserRole.ADMIN:
            metaData = await getAdminMetaData()
            break

        case UserRole.DOCTOR:
            metaData = await getDoctorMetaData(user)
            break

        case UserRole.PATIENT:
            metaData = await getPatientMetaData(user)
            break

        default:
            throw new AppError(403, "Invalid user role!")
    }


    return metaData

}


const getDoctorMetaData = async (user: IJWTPayload) => {
}

const getPatientMetaData = async (user: IJWTPayload) => {
}


const getAdminMetaData = async () => {
    const patientCount = await prisma.patient.count()
    const doctorCount = await prisma.doctor.count()
    const adminCount = await prisma.admin.count();
    const appointmentCount = await prisma.appointment.count();
    const totalPayment = await prisma.payment.count();

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: PaymentStatus.PAID
        }
    })


    const barChartData = await getBarChartData();
    const pieChartData = await getPieChart()

    return {
        patientCount,
        doctorCount,
        adminCount,
        appointmentCount,
        totalPayment,
        totalRevenue,
        pieChartData,
        barChartData
    }


}


const getBarChartData = async () => {
    const appointmentCountPerMonth = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createAt") AS month, 
    CAST(COUNT(*) AS INTEGER) AS count
    FROM "appointments"
    GROUP BY month
    ORDER BY month ASC 
    `
    return appointmentCountPerMonth
}

  
const getPieChart = async () => {
    const appointmentStatus = await prisma.appointment.groupBy({
        by: ['status'],
        _count: { id: true }
    })

    const formatedAppointmentStatusDistribution = appointmentStatus.map(({ status, _count }) => (
        {
            status,
            count: Number(_count.id)
        }
    ))

    return formatedAppointmentStatusDistribution;
}

export const MetaService = {
    getDashboardMeta
}
