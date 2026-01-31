import { prisma } from "../../lib/prisma";

const createReview = async (userId: string, payload: any) => {
    const { medicineId, rating, comment } = payload;
    const hasOrdered = await prisma.order.findFirst({
        where: {
            customerId: userId,
            items: {
                some: {
                    medicineId
                }
            }
        }
    });

    if (!hasOrdered) {
        throw new Error("You cannot review this medicine, because you haven't ordered it yet.");
    }

    const isDelivered = await prisma.order.findFirst({
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

    if (!isDelivered) {
        throw new Error("You can only provide a review after delivered.");
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

export const reviewService = {
    createReview,
    getMedicineReviews
};