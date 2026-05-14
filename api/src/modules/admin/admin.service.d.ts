export type CategorySalesRow = {
    categoryId: string;
    categoryName: string;
    revenue: number;
    unitsSold: number;
};
export declare const adminAnalyticsService: {
    getDashboard(): Promise<{
        totalRevenue: number;
        orders: {
            total: number;
            paid: number;
            pendingPayment: number;
        };
        categorySales: CategorySalesRow[];
    }>;
};
//# sourceMappingURL=admin.service.d.ts.map