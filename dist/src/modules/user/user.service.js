import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";
const getMyProfile = async (userId) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            role: true
        }
    });
};
const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            image: true,
            createdAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};
const adminStats = async () => {
    try {
        const [totalUser, customerCount, sellerCount, totalCategories, totalMedicines, totalReviews, totalOrders] = await prisma.$transaction([
            prisma.user.count(),
            prisma.user.count({ where: { role: "CUSTOMER" } }),
            prisma.user.count({ where: { role: "SELLER" } }),
            prisma.category.count(),
            prisma.medicine.count(),
            prisma.review.count(),
            prisma.order.count(),
        ]);
        const orderGroups = await prisma.order.groupBy({
            by: ["status"],
            _count: { _all: true },
            _sum: { totalAmount: true },
        });
        const statusMap = {
            PLACED: { count: 0, amount: 0 },
            PROCESSING: { count: 0, amount: 0 },
            SHIPPED: { count: 0, amount: 0 },
            DELIVERED: { count: 0, amount: 0 },
            CANCELLED: { count: 0, amount: 0 }
        };
        let totalRevenue = 0;
        orderGroups.forEach((group) => {
            const statusKey = group.status?.toUpperCase();
            if (statusKey && statusMap[statusKey]) {
                statusMap[statusKey] = {
                    count: group._count._all || 0,
                    amount: group._sum.totalAmount || 0
                };
                if (statusKey === "DELIVERED") {
                    totalRevenue = group._sum.totalAmount || 0;
                }
            }
        });
        return {
            success: true,
            stats: {
                revenue: totalRevenue,
                users: { total: totalUser, customers: customerCount, sellers: sellerCount },
                inventory: { medicines: totalMedicines, categories: totalCategories },
                orders: {
                    total: totalOrders,
                    statusSummary: statusMap
                },
                reviews: totalReviews,
            }
        };
    }
    catch (error) {
        console.error("Admin stats error:", error);
        return { success: false, message: "Failed to fetch stats" };
    }
};
const sellerStats = async (sellerId) => {
    const myMedicinesCount = await prisma.medicine.count({
        where: { sellerId }
    });
    const myOrdersCount = await prisma.order.count({
        where: {
            items: {
                some: {
                    medicine: { sellerId }
                }
            }
        }
    });
    const sellerOrderItems = await prisma.orderItem.findMany({
        where: {
            medicine: { sellerId }
        },
        select: {
            order: {
                select: { status: true }
            }
        }
    });
    const statusCounts = {
        placed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    };
    sellerOrderItems.forEach((item) => {
        const status = item.order.status.toLowerCase();
        if (statusCounts[status] !== undefined) {
            statusCounts[status]++;
        }
    });
    const deliveredItems = await prisma.orderItem.findMany({
        where: {
            medicine: { sellerId },
            order: { status: "DELIVERED" }
        },
        select: {
            price: true,
            quantity: true
        }
    });
    const totalRevenue = deliveredItems.reduce((sum, item) => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        return sum + itemTotal;
    }, 0);
    const myReviewsCount = await prisma.review.count({
        where: {
            medicine: { sellerId }
        }
    });
    const myCategoriesCount = await prisma.category.count({
        where: {
            medicine: { some: { sellerId } }
        }
    });
    return {
        category: { total: myCategoriesCount },
        medicine: { total: myMedicinesCount },
        order: {
            total: myOrdersCount,
            ...statusCounts
        },
        review: { total: myReviewsCount },
        revenue: { total: totalRevenue }
    };
};
const customerStats = async (userId) => {
    const [ordersCount, reviewsCount, orderSummary, totalSpent, pendingOrders, unreviewedItemsCount] = await Promise.all([
        prisma.order.count({ where: { customerId: userId } }),
        prisma.review.count({ where: { userId } }),
        prisma.order.groupBy({
            by: ["status"],
            where: { customerId: userId },
            _count: { id: true }
        }),
        prisma.order.aggregate({
            where: {
                customerId: userId,
                status: "DELIVERED"
            },
            _sum: { totalAmount: true }
        }),
        prisma.order.count({
            where: {
                customerId: userId,
                status: { in: ["PLACED", "PROCESSING", "SHIPPED"] }
            }
        }),
        prisma.orderItem.count({
            where: {
                order: {
                    customerId: userId,
                    status: "DELIVERED"
                },
                medicine: {
                    reviews: {
                        none: { userId: userId }
                    }
                }
            }
        })
    ]);
    const statusCounts = orderSummary.reduce((acc, curr) => {
        acc[curr.status.toLowerCase()] = curr._count.id;
        return acc;
    }, {});
    return {
        totalOrders: ordersCount,
        totalReviews: reviewsCount,
        totalSpent: totalSpent._sum.totalAmount || 0,
        activeOrders: pendingOrders,
        pendingReviews: unreviewedItemsCount,
        orderStats: statusCounts
    };
};
const updateProfile = async (userId, payload) => {
    const isUserExist = await prisma.user.findUnique({ where: { id: userId } });
    if (!isUserExist)
        throw new AppError("User not found!", 404);
    return await prisma.user.update({
        where: { id: userId },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            role: true
        }
    });
};
export const userService = {
    getMyProfile,
    getAllUsers,
    adminStats,
    sellerStats,
    customerStats,
    updateProfile,
};
//# sourceMappingURL=user.service.js.map