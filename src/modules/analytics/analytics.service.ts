import { prisma } from "../../lib/prisma";

const getSellerStats = async (sellerId: string) => {
    const revenue = await prisma.orderItem.aggregate({
        where: {
            medicine: {
                sellerId
            },
            order: {
                status: 'DELIVERED'
            }
        },
        _sum: {
            price: true
        }
    });

    // Sales Total Orders
    const totalOrders = await prisma.orderItem.groupBy({
        by: ['orderId'],
        where: {
            medicine: {
                sellerId
            }
        }
    });

    // Sales per Medicine
    const salesByMedicine = await prisma.orderItem.groupBy({
        by: ['medicineId'],
        where: {
            medicine: {
                sellerId
            }
        },
        _count: {
            id: true
        }
    });

    // low stock
    const lowStockMedicines = await prisma.medicine.count({
        where: {
            sellerId,
            stock: {
                lt: 5
            }
        }
    });

    return {
        totalRevenue: revenue._sum.price || 0,
        uniqueOrdersCount: totalOrders.length,
        distinctMedicinesSold: salesByMedicine.length,
        lowStockCount: lowStockMedicines
    };
};

const getAdminStats = async () => {
    const totalSales = await prisma.order.aggregate({
        where: {
            status: 'DELIVERED'
        },
        _sum: {
            totalAmount: true
        }
    });

    const userCount = await prisma.user.groupBy({
        by: ['role'],
        _count: {
            id: true
        }
    });

    const formatUser = userCount.map(item => ({
        role: item.role,
        count: item._count.id
    }));

    const totalMedicineCount = await prisma.medicine.count();

    return {
        totalPlatformRevenue: totalSales._sum.totalAmount || 0,
        FormatUser: formatUser,
        totalMedicines: totalMedicineCount
    };
};

export const analyticsService = {
    getSellerStats,
    getAdminStats
};