import { User } from "../../../generated/prisma/client";
export declare const userService: {
    getMyProfile: (userId: string) => Promise<{
        id: string;
        name: string;
        role: string;
        phone: string | null;
        email: string;
        image: string | null;
    } | null>;
    getAllUsers: () => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        role: string;
        phone: string | null;
        email: string;
        image: string | null;
    }[]>;
    adminStats: () => Promise<{
        user: {
            total: number;
            customer: number;
            seller: number;
            admin: number;
        };
        category: {
            total: number;
        };
        medicine: {
            total: number;
        };
        order: any;
        review: {
            total: number;
        };
    }>;
    sellerStats: () => Promise<{
        category: {
            total: number;
        };
        medicine: {
            total: number;
        };
        order: any;
        review: {
            total: number;
        };
    }>;
    customerStats: (user: Partial<User>) => Promise<{
        ordersCount: number;
        reviewsCount: number;
        orderCountByStatus: {
            [k: string]: number;
        };
        orderAmountByStatus: {
            [k: string]: number;
        };
    }>;
    updateProfile: (userId: string, payload: any) => Promise<{
        id: string;
        name: string;
        role: string;
        phone: string | null;
        email: string;
        image: string | null;
    }>;
};
//# sourceMappingURL=user.service.d.ts.map