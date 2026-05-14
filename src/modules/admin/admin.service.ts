import { prisma } from "../../lib/prisma";

export type CategorySalesRow = {
  categoryId: string;
  categoryName: string;
  revenue: number;
  unitsSold: number;
};

export const adminAnalyticsService = {
  async getDashboard() {
    const paidOrders = await prisma.order.findMany({
      where: { paymentStatus: "PAID" },
      include: {
        items: {
          include: {
            medicine: {
              include: { category: { select: { id: true, name: true } } },
            },
          },
        },
      },
    });

    let totalRevenue = 0;
    for (const o of paidOrders) {
      totalRevenue += o.totalAmount;
    }

    const [totalOrders, paidOrderCount, pendingPaymentCount] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { paymentStatus: "PAID" } }),
      prisma.order.count({ where: { paymentStatus: "PENDING" } }),
    ]);

    const categoryMap = new Map<string, CategorySalesRow>();

    for (const o of paidOrders) {
      for (const it of o.items) {
        const cat = it.medicine.category;
        const line = it.price * it.quantity;
        const prev = categoryMap.get(cat.id) ?? {
          categoryId: cat.id,
          categoryName: cat.name,
          revenue: 0,
          unitsSold: 0,
        };
        prev.revenue += line;
        prev.unitsSold += it.quantity;
        categoryMap.set(cat.id, prev);
      }
    }

    const categorySales = [...categoryMap.values()].sort((a, b) => b.revenue - a.revenue);

    return {
      totalRevenue,
      orders: {
        total: totalOrders,
        paid: paidOrderCount,
        pendingPayment: pendingPaymentCount,
      },
      categorySales,
    };
  },
};
