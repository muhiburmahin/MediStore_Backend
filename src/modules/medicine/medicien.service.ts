import { medicine, Prisma } from "../../../generated/prisma/client";
import { paginationHelpers } from "../../helpers/paginationHelper";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";

const createMedicine = async (payload: medicine) => {
    const { name, description, price, stock, manufacturer, imageUrl, categoryId, sellerId,
    } = payload;

    const seller = await prisma.user.findUnique({
        where: {
            id: sellerId
        },
    });

    if (!seller) {
        throw new AppError("Seller not found", 404);
    }

    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        },
    });

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    const medicine = await prisma.medicine.create({
        data: {
            name, description, price, stock,
            manufacturer, imageUrl, categoryId, sellerId,
        },
    });

    return medicine;
};

//Get all midisine
const getAllMedicines = async ({ search, page, limit, skip, sortBy, sortOrder }: {
    search: string | undefined;
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}, paginationResult?: { page: number; limit: number; skip: number; sortBy: string; sortOrder: string; }) => {
    const andConditions: Prisma.medicineWhereInput[] = [];
    if (search) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: search as string,
                        mode: "insensitive"
                    }
                },
                {
                    description: {
                        contains: search as string,
                        mode: "insensitive",
                    },
                },
                {
                    manufacturer: {
                        contains: search as string,
                        mode: "insensitive",
                    },
                },
                {
                    category: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        });
    }
    const result = await prisma.medicine.findMany({
        take: limit,
        skip: skip,
        where: {
            AND: andConditions,
        },
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true
                },
            },
            reviews: {
                select: {
                    rating: true,
                    comment: true,
                }
            }
        },
    });

    const total = await prisma.medicine.count({
        where: {
            AND: andConditions,
        },
    });

    return {
        data: result,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};



const getMedicineById = async (id: string) => {
    return await prisma.medicine.findUniqueOrThrow({
        where: { id },
        include: {
            category: {
                select: {
                    id: true,
                    name: true
                },
            },
            seller: true,
        },
    });
};

const updateMedicineById = async (id: string, userId: string, userRole: string, payload: any) => {
    const medicine = await prisma.medicine.findFirstOrThrow({
        where: {
            id
        }
    });
    if (!medicine) throw new AppError("Medicine not found", 404);

    if (userRole !== 'ADMIN' && medicine.sellerId !== userId) {
        throw new AppError("Unauthorized! You can only update your own medicines", 403);
    }


    return await prisma.medicine.update({
        where: {
            id
        },
        data: payload,
    });
};

const deleteMedicineById = async (id: string, userId: string, userRole: string) => {

    const medicine = await prisma.medicine.findUnique({
        where: {
            id
        },
    });

    if (!medicine) {
        throw new AppError("Medicine not found", 404);
    }

    if (userRole !== 'ADMIN' && medicine.sellerId !== userId) {
        throw new AppError("You can only delete your own medicines", 403);
    }

    return await prisma.medicine.delete({
        where: {
            id
        },
    });
};


export const medicineService = {
    createMedicine,
    getAllMedicines,
    getMedicineById,
    updateMedicineById,
    deleteMedicineById,
};