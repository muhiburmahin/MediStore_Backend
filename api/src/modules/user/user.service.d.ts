type OrderStatus = 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export declare const userService: {
    getMyProfile: (userId: string) => Promise<{
        name: string;
        id: string;
        role: import("../../generated/prisma/client").$Enums.Role;
        phone: string | null;
        email: string;
        image: string | null;
    } | null>;
    getAllUsers: () => Promise<{
        name: string;
        id: string;
        createdAt: Date;
        role: import("../../generated/prisma/client").$Enums.Role;
        phone: string | null;
        email: string;
        image: string | null;
    }[]>;
    adminStats: () => Promise<{
        success: boolean;
        stats: {
            revenue: number;
            users: {
                total: number;
                customers: number;
                sellers: number;
            };
            inventory: {
                medicines: number;
                categories: number;
            };
            orders: {
                total: number;
                statusSummary: Record<OrderStatus, {
                    count: number;
                    amount: number;
                }>;
            };
            reviews: number;
        };
        message?: never;
    } | {
        success: boolean;
        message: string;
        stats?: never;
    }>;
    sellerStats: (sellerId: string) => Promise<{
        category: {
            total: number;
        };
        medicine: {
            total: number;
        };
        order: {
            total: number;
        };
        review: {
            total: number;
        };
        revenue: {
            total: number;
        };
    }>;
    customerStats: (userId: string) => Promise<{
        totalOrders: number;
        totalReviews: number;
        totalSpent: number;
        activeOrders: number;
        pendingReviews: number;
        orderStats: Record<string, number>;
    }>;
    updateProfile: (userId: string, payload: any) => Promise<{
        name: string;
        id: string;
        role: import("../../generated/prisma/client").$Enums.Role;
        phone: string | null;
        email: string;
        image: string | null;
    }>;
};
export {};
//# sourceMappingURL=user.service.d.ts.map