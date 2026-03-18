import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";

interface ICreateReviewPayload {
    medicineId: string;
    rating: number | string;
    comment?: string;
}

const createReview = async (userId: string, payload: ICreateReviewPayload) => {
    const { medicineId, rating, comment } = payload;

    const existingReview = await prisma.review.findFirst({
        where: { userId, medicineId }
    });
    if (existingReview) throw new AppError("You have already reviewed this medicine.", 400);

    const deliveredOrder = await prisma.order.findFirst({
        where: {
            customerId: userId,
            status: "DELIVERED",
            items: {
                some: { medicineId }
            }
        }
    });
    if (!deliveredOrder) throw new AppError("You can only review after the product is delivered.", 403);

    return await prisma.review.create({
        data: {
            rating: Number(rating),
            comment: comment || null,
            userId,
            medicineId
        }
    });
};

const getMedicineReviews = async (medicineId: string) => {
    return await prisma.review.findMany({
        where: { medicineId },
        include: {
            user: { select: { name: true, image: true } }
        },
        orderBy: { createdat: 'desc' }
    });
};

const getSingleMedicineWithAverageRating = async (id: string) => {
    const medicine = await prisma.medicine.findUnique({
        where: { id },
        include: {
            category: true,
            _count: { select: { reviews: true } }
        }
    });

    if (!medicine) return null;
    const [aggregate, ratingStats, reviews] = await Promise.all([
        prisma.review.aggregate({
            where: { medicineId: id },
            _avg: { rating: true }
        }),
        prisma.review.groupBy({
            by: ['rating'],
            where: { medicineId: id },
            _count: { rating: true }
        }),
        prisma.review.findMany({
            where: { medicineId: id },
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdat: 'desc' },
            take: 10
        })
    ]);

    const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingStats.forEach(stat => {
        starCounts[stat.rating] = stat._count.rating;
    });

    return {
        ...medicine,
        reviews,
        averageRating: aggregate._avg.rating ? parseFloat(aggregate._avg.rating.toFixed(1)) : 0,
        totalReviews: medicine._count.reviews,
        starCounts
    };
};

export const reviewService = {
    createReview,
    getMedicineReviews,
    getSingleMedicineWithAverageRating
};