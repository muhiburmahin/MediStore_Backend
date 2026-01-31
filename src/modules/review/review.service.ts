import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";

const createReview = async (userId: string, payload: any) => {
    const { medicineId, rating, comment } = payload;

    const existingReview = await prisma.review.findFirst({
        where: {
            userId,
            medicineId
        }
    });

    if (existingReview) {
        throw new AppError("You have already reviewed for this medicine.", 400);
    }

    const deliveredOrder = await prisma.order.findFirst({
        where: {
            customerId: userId,
            status: "DELIVERED",
            items: {
                some: {
                    medicineId
                }
            }
        }
    });

    if (!deliveredOrder) {
        throw new AppError("You can only review after the product is delivered.", 403);
    }

    return await prisma.review.create({
        data: {
            rating: Number(rating),
            comment: comment || null,
            userId: userId,
            medicineId: medicineId
        }
    });
};

const getMedicineReviews = async (medicineId: string) => {
    return await prisma.review.findMany({
        where: {
            medicineId
        },
        include: {
            user: {
                select: {
                    name: true,
                    image: true
                }
            }
        },
        orderBy: {
            createdat: 'desc'
        }
    });
};

export const getSingleMedicineWithAverageRating = async (id: string) => {
    const medicine = await prisma.medicine.findUnique({
        where: {
            id
        },
        include: {
            reviews: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    reviews: true
                }
            }
        }
    });

    if (!medicine) return null;

    // Average Rating
    const aggregate = await prisma.review.aggregate({
        where: { medicineId: id },
        _avg: {
            rating: true
        }
    });

    return {
        ...medicine,
        averageRating: aggregate._avg.rating || 0,
        totalReviews: medicine._count.reviews
    };
};



export const reviewService = {
    createReview,
    getMedicineReviews,
    getSingleMedicineWithAverageRating
};