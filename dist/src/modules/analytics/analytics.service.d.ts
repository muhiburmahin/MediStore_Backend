export declare const analyticsService: {
    getSellerStats: (sellerId: string) => Promise<{
        totalRevenue: number;
        uniqueOrdersCount: number;
        distinctMedicinesSold: number;
        lowStockCount: number;
    }>;
    getAdminStats: () => Promise<{
        totalPlatformRevenue: number;
        FormatUser: {
            role: string;
            count: number;
        }[];
        totalMedicines: number;
    }>;
};
//# sourceMappingURL=analytics.service.d.ts.map