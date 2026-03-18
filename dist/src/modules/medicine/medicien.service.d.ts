import { medicine } from "../../../generated/prisma/client";
import { IOptions } from "../../helpers/paginationHelper";
export declare const medicineService: {
    createMedicine: (payload: medicine) => Promise<medicine>;
    getAllMedicines: (filters: {
        search?: string;
        categoryId?: string;
        sellerId?: string;
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
                id: string;
                name: string;
            };
            _count: {
                reviews: number;
            };
            seller: {
                id: string;
                name: string;
                email: string;
            };
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            price: number;
            stock: number;
            manufacturer: string;
            images: string[];
            categoryId: string;
            sellerId: string;
        }[];
    }>;
    getMedicineById: (id: string) => Promise<{
        averageRating: number;
        totalReviews: number;
        starCounts: Record<number, number>;
        category: {
            id: string;
            name: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        _count: {
            reviews: number;
        };
        reviews: ({
            user: {
                name: string;
                image: string | null;
            };
        } & {
            id: string;
            userId: string;
            medicineId: string;
            rating: number;
            createdat: Date;
            comment: string | null;
        })[];
        seller: {
            name: string;
            email: string;
        };
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
        manufacturer: string;
        images: string[];
        categoryId: string;
        sellerId: string;
    }>;
    updateMedicineById: (id: string, userId: string, userRole: string, payload: Partial<medicine>) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
        manufacturer: string;
        images: string[];
        categoryId: string;
        sellerId: string;
    }>;
    deleteMedicineById: (id: string, userId: string, userRole: string) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
        manufacturer: string;
        images: string[];
        categoryId: string;
        sellerId: string;
    }>;
};
//# sourceMappingURL=medicien.service.d.ts.map