import { Doctor, Prisma } from "@prisma/client";
import { doctorSearchableFields } from "./doctor.constant";
import { IDoctorUpdateInput } from "./doctor.interface";
import { prisma } from "../../../config/db";
import { calcultatepagination, Ioptions } from "../../helpers/paginationHelper";
import httpStatus from "http-status"
import AppError from "../../customizeErr/AppError";
import { openai } from "../../helpers/open-router";

const getAllFromDB = async (filters: any, options: Ioptions) => {
    const { page, limit, skip, sortBy, sortOrder } = calcultatepagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    // "", "medicine"
    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: "insensitive"
                        }
                    }
                }
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))

        andConditions.push(...filterConditions)
    }

    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            },
            Review:true
        },
        
    });

    const total = await prisma.doctor.count({
        where: whereConditions
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

const updateIntoDB = async (id: string, payload: Partial<IDoctorUpdateInput>) => {
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    const { specialties, ...doctorData } = payload;

    console.log("specialties:", specialties)

    return await prisma.$transaction(async (tnx: any) => {
        if (specialties && specialties.length > 0) {
            const deleteSpecialtyIds = specialties.filter((specialty) => specialty.isDeleted);

            for (const specialty of deleteSpecialtyIds) {
                await tnx.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: id,
                        specialitiesId: specialty.specialtyId
                    }
                })
            }

            const createSpecialtyIds = specialties.filter((specialty) => !specialty.isDeleted);

            for (const specialty of createSpecialtyIds) {
                await tnx.doctorSpecialties.create({
                    data: {
                        doctorId: id,
                        specialitiesId: specialty.specialtyId
                    }
                })
            }

        }

        const updatedData = await tnx.doctor.update({
            where: {
                id: doctorInfo.id
            },
            data: doctorData,
            include: {
                doctorSpecialties: {
                    include: {
                        specialities: true
                    }
                }
            }

            //  doctor - doctorSpecailties - specialities 
        })

        return updatedData
    })


}


// const updateIntoDB = async (id: string, payload: Partial<Doctor>) => {
//     const doctorInfo = await prisma.doctor.findUniqueOrThrow({
//         where: {
//             id
//         }
//     });

//     const updateInfo = await prisma.doctor.update({
//         where: {id:doctorInfo.id},
//         data: payload
//     })

//     // const { specialties, ...doctorData } = payload;

//     console.log("specialties:", updateInfo)
//     return updateInfo



// }


const getAISuggesions = async (payload: { symptoms: string }) => {
    if (!(payload && payload.symptoms)) {
        throw new AppError(httpStatus.BAD_REQUEST, "symptoms is required!")
    };

    const doctors = await prisma.doctor.findMany({
        where: { isDeleted: false },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    console.log("doctors data loaded.......\n");
    const prompt = `
You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors.
Each doctor has specialties and years of experience.
Only suggest doctors who are relevant to the given symptoms.

Symptoms: ${payload.symptoms}

Here is the doctor list (in JSON):
${JSON.stringify(doctors, null, 2)}

Return your response in JSON format with full individual doctor data. 
`;

    console.log("analyzing......\n")
    try {
        const completion = await openai.chat.completions.create({
            model: 'z-ai/glm-4.5-air:free',
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful AI medical assistant that provides doctor suggestions.",
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });


        console.log(completion.choices[0].message)
        const response = completion.choices[0].message;

        // Extract the JSON string between ```json and ```
        const jsonMatch = response.content?.match(/```json([\s\S]*?)```/);

        if (jsonMatch) {
            const doctorData = JSON.parse(jsonMatch[1].trim());
            console.log("doctorData", doctorData);
            return doctorData
        } else {
            console.error("No JSON found in response");
        }
    } catch (err) {
        console.error("AI error:", err);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "AI request failed!");
    }

    // const result = await extractJsonFromMessage(completion.choices[0].message)
    // return result;
}




const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
    console.log("id:", id)
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
            doctorSchedules: {
                include: {
                    schedule: true
                }
            }
        },
    });
    return result;
};

export const DoctorService = {
    getAllFromDB,
    updateIntoDB,
    getAISuggesions,
    getByIdFromDB
}