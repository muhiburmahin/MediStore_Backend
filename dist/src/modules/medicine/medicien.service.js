import { paginationHelpers } from "../../helpers/paginationHelper";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";
const createMedicine = async (payload) => {
    const { name, description, price, stock, manufacturer, images, categoryId, sellerId } = payload;
    const [isSellerExist, isCategoryExist] = await Promise.all([
        prisma.user.findUnique({ where: { id: sellerId } }),
        prisma.category.findUnique({ where: { id: categoryId } })
    ]);
    if (!isSellerExist)
        throw new AppError("Seller account not found.", 404);
    if (!isCategoryExist)
        throw new AppError("Invalid category selected.", 404);
    return await prisma.medicine.create({
        data: {
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            manufacturer,
            images,
            categoryId,
            sellerId
        },
        include: {
            category: true,
            seller: { select: { id: true, name: true, email: true } }
        }
    });
};
const getAllMedicines = async (filters, options) => {
    const { search, categoryId, sellerId } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);
    const andConditions = [];
    if (sellerId) {
        andConditions.push({ sellerId });
    }
    if (search) {
        andConditions.push({
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { manufacturer: { contains: search, mode: "insensitive" } }
            ],
        });
    }
    if (categoryId) {
        andConditions.push({ categoryId });
    }
    const whereConditions = andConditions.length > 0
        ? { AND: andConditions }
        : {};
    const result = await prisma.medicine.findMany({
        where: whereConditions,
        take: limit,
        skip: skip,
        orderBy: sortBy && sortOrder
            ? { [sortBy]: sortOrder }
            : { createdAt: 'desc' },
        include: {
            category: { select: { id: true, name: true } },
            seller: { select: { id: true, name: true, email: true } },
            _count: {
                select: { reviews: true }
            }
        },
    });
    const medicinesWithRatings = await Promise.all(result.map(async (medicine) => {
        const aggregate = await prisma.review.aggregate({
            where: { medicineId: medicine.id },
            _avg: { rating: true }
        });
        return {
            ...medicine,
            averageRating: aggregate._avg.rating ? parseFloat(aggregate._avg.rating.toFixed(1)) : 0,
            totalReviews: medicine._count.reviews
        };
    }));
    const totalCount = await prisma.medicine.count({
        where: whereConditions
    });
    return {
        meta: {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
        },
        data: medicinesWithRatings,
    };
};
const getMedicineById = async (id) => {
    const medicine = await prisma.medicine.findUniqueOrThrow({
        where: { id },
        include: {
            category: true,
            seller: {
                select: { name: true, email: true }
            },
            reviews: {
                include: {
                    user: { select: { name: true, image: true } }
                },
                orderBy: {
                    createdat: 'desc'
                }
            },
            _count: {
                select: { reviews: true }
            }
        },
    });
    const aggregate = await prisma.review.aggregate({
        where: { medicineId: id },
        _avg: {
            rating: true
        }
    });
    const ratingStats = await prisma.review.groupBy({
        by: ['rating'],
        where: { medicineId: id },
        _count: {
            rating: true
        }
    });
    const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingStats.forEach(stat => {
        starCounts[stat.rating] = stat._count.rating;
    });
    return {
        ...medicine,
        averageRating: aggregate._avg.rating ? parseFloat(aggregate._avg.rating.toFixed(1)) : 0,
        totalReviews: medicine._count.reviews,
        starCounts
    };
};
const updateMedicineById = async (id, userId, userRole, payload) => {
    const medicineRecord = await prisma.medicine.findUniqueOrThrow({ where: { id } });
    if (userRole !== 'ADMIN' && medicineRecord.sellerId !== userId) {
        throw new AppError("Unauthorized! You can only update your own products.", 403);
    }
    if (payload.price)
        payload.price = Number(payload.price);
    if (payload.stock)
        payload.stock = Number(payload.stock);
    return await prisma.medicine.update({
        where: { id },
        data: payload,
    });
};
const deleteMedicineById = async (id, userId, userRole) => {
    const medicineRecord = await prisma.medicine.findUniqueOrThrow({ where: { id } });
    if (userRole !== 'ADMIN' && medicineRecord.sellerId !== userId) {
        throw new AppError("Forbidden! You cannot delete someone else's product.", 403);
    }
    return await prisma.medicine.delete({ where: { id } });
};
export const medicineService = {
    createMedicine,
    getAllMedicines,
    getMedicineById,
    updateMedicineById,
    deleteMedicineById,
};
//# sourceMappingURL=medicien.service.js.map