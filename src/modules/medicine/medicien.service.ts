import { medicine, Prisma } from "@prisma/client";
import { paginationHelpers, IOptions } from "../../helpers/paginationHelper";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";
import { notificationService } from "../notification/notification.service";


const createMedicine = async (payload: medicine): Promise<medicine> => {
    const {
        name,
        description,
        price,
        stock,
        manufacturer,
        images,
        categoryId,
        sellerId
    } = payload;

    const [isSellerExist, isCategoryExist] = await Promise.all([
        prisma.user.findUnique({ where: { id: sellerId } }),
        prisma.category.findUnique({ where: { id: categoryId } })
    ]);

    if (!isSellerExist) throw new AppError("Seller account not found.", 404);
    if (!isCategoryExist) throw new AppError("Invalid category selected.", 404);

    const created = await prisma.medicine.create({
        data: {
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            manufacturer,
            categoryId,
            sellerId,
            ...(images !== undefined && images !== null
                ? { images: images as Prisma.InputJsonValue }
                : {}),
        },
        include: {
            category: true,
            seller: { select: { id: true, name: true, email: true } }
        }
    });

    void notificationService
        .create(
            sellerId,
            "Medicine listed",
            `"${created.name}" is now live in your shop (${created.stock} in stock, ৳${Number(created.price).toFixed(2)}).`,
            "MEDICINE"
        )
        .catch(() => undefined);

    return created;
};

type MedicineListFilters = {
    search?: string;
    categoryId?: string;
    sellerId?: string;
    category?: string;
};

const queryScalar = (v: unknown): string | undefined => {
    if (v === undefined || v === null) return undefined;
    if (Array.isArray(v)) return v.length ? String(v[0]) : undefined;
    return String(v);
};

const MEDICINE_SORT_FIELDS = new Set(["createdAt", "price", "name", "stock", "manufacturer"]);

const getAllMedicines = async (filters: MedicineListFilters, options: IOptions) => {
    const search = queryScalar(filters.search);
    const categoryId = queryScalar(filters.categoryId);
    const sellerId = queryScalar(filters.sellerId);
    const category = queryScalar(filters.category);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);

    const andConditions: Prisma.medicineWhereInput[] = [];

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
    if (category) {
        andConditions.push({
            category: {
                name: {
                    equals: category,
                    mode: "insensitive",
                },
            },
        });
    }

    const whereConditions: Prisma.medicineWhereInput = andConditions.length > 0
        ? { AND: andConditions }
        : {};

    const sortField = MEDICINE_SORT_FIELDS.has(sortBy) ? sortBy : "createdAt";
    const orderBy = { [sortField]: sortOrder } as Prisma.medicineOrderByWithRelationInput;

    const result = await prisma.medicine.findMany({
        where: whereConditions,
        take: limit,
        skip: skip,
        orderBy,
        include: {
            category: { select: { id: true, name: true } },
            seller: { select: { id: true, name: true, email: true } },
            _count: {
                select: { reviews: true }
            }
        },
    });

    const medicinesWithRatings = await Promise.all(
        result.map(async (medicine) => {
            const aggregate = await prisma.review.aggregate({
                where: { medicineId: medicine.id },
                _avg: { rating: true }
            });

            return {
                ...medicine,
                averageRating: aggregate._avg.rating ? parseFloat(aggregate._avg.rating.toFixed(1)) : 0,
                totalReviews: medicine._count.reviews
            };
        })
    );

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

const getMedicineById = async (id: string) => {
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
                    createdAt: 'desc'
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

    const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
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


const updateMedicineById = async (
    id: string,
    userId: string,
    userRole: string,
    payload: Partial<medicine>
) => {
    const medicineRecord = await prisma.medicine.findUniqueOrThrow({ where: { id } });
    if (userRole !== 'ADMIN' && medicineRecord.sellerId !== userId) {
        throw new AppError("Unauthorized! You can only update your own products.", 403);
    }

    const data: Prisma.medicineUpdateInput = {};
    if (payload.name !== undefined) data.name = payload.name;
    if (payload.description !== undefined) data.description = payload.description;
    if (payload.price !== undefined) data.price = Number(payload.price);
    if (payload.stock !== undefined) data.stock = Number(payload.stock);
    if (payload.manufacturer !== undefined) data.manufacturer = payload.manufacturer;
    if (payload.images !== undefined) {
        data.images = payload.images === null ? Prisma.JsonNull : (payload.images as Prisma.InputJsonValue);
    }
    if (payload.categoryId !== undefined) {
        data.category = { connect: { id: payload.categoryId } };
    }

    if (Object.keys(data).length === 0) {
        return medicineRecord;
    }

    return await prisma.medicine.update({
        where: { id },
        data,
    });
};

const deleteMedicineById = async (id: string, userId: string, userRole: string) => {
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