import { medicine, Prisma } from "../../generated/prisma/client";
import { IOptions } from "../../helpers/paginationHelper";
export declare const medicineService: {
    createMedicine: (payload: medicine) => Promise<medicine>;
    getAllMedicines: (filters: {
        search?: string;
        categoryId?: string;
        sellerId?: string;
        category?: string;
    }, options: IOptions) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: {
            averageRating: number;
            totalReviews: number;
            category: {
                name: string;
                id: string;
            };
            seller: {
                name: string;
                id: string;
                email: string;
            };
            _count: {
                reviews: number;
            };
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            price: number;
            stock: number;
            manufacturer: string;
            images: Prisma.JsonValue | null;
            categoryId: string;
            sellerId: string;
        }[];
    }>;
    getMedicineById: (id: string) => Promise<{
        averageRating: number;
        totalReviews: number;
        starCounts: Record<number, number>;
        category: {
            name: string;
            id: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        seller: {
            name: string;
            email: string;
        };
        reviews: ({
            user: {
                name: string;
                image: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            medicineId: string;
            rating: number;
            comment: string | null;
        })[];
        _count: {
            reviews: number;
        };
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
        manufacturer: string;
        images: Prisma.JsonValue | null;
        categoryId: string;
        sellerId: string;
    }>;
    updateMedicineById: (id: string, userId: string, userRole: string, payload: Partial<medicine>) => Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
        manufacturer: string;
        images: Prisma.JsonValue | null;
        categoryId: string;
        sellerId: string;
    }>;
    deleteMedicineById: (id: string, userId: string, userRole: string) => Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
        manufacturer: string;
        images: Prisma.JsonValue | null;
        categoryId: string;
        sellerId: string;
    }>;
};
//# sourceMappingURL=medicien.service.d.ts.map