import { paginationHelpers } from "../../helpers/paginationHelper";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";
const createMedicine = async (payload) => {
    const { name, description, price, stock, manufacturer, imageUrl, categoryId, sellerId, } = payload;
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
const getAllMedicines = async (filters, options) => {
    const { search, categoryId } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);
    const andConditions = [];
    if (search) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    manufacturer: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    category: {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                }
            ],
        });
    }
    if (categoryId) {
        andConditions.push({
            categoryId: categoryId
        });
    }
    const whereConditions = andConditions.length > 0
        ? { AND: andConditions }
        : {};
    const result = await prisma.medicine.findMany({
        where: whereConditions,
        take: limit,
        skip: skip,
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
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        data: result,
    };
};
const getMedicineById = async (id) => {
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
const updateMedicineById = async (id, userId, userRole, payload) => {
    const medicine = await prisma.medicine.findFirstOrThrow({
        where: {
            id
        }
    });
    if (!medicine)
        throw new AppError("Medicine not found", 404);
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
const deleteMedicineById = async (id, userId, userRole) => {
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
//# sourceMappingURL=medicien.service.js.map