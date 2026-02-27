import { medicine } from "../../../generated/prisma/client";
import { IOptions } from "../../helpers/paginationHelper";
export declare const medicineService: {
    createMedicine: (payload: medicine) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
        categoryId: string;
        sellerId: string;
    }>;
    getAllMedicines: (filters: {
        search?: string;
        categoryId?: string;
    }, options: IOptions) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: ({
            category: {
                id: string;
                name: string;
            };
            reviews: {
                comment: string | null;
                rating: number;
            }[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            price: number;
            stock: number;
            manufacturer: string;
            imageUrl: string | null;
            categoryId: string;
            sellerId: string;
        })[];
    }>;
    getMedicineById: (id: string) => Promise<{
        category: {
            id: string;
            name: string;
        };
        seller: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            role: string;
            status: string;
            phone: string | null;
            email: string;
            emailVerified: boolean;
            image: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
        categoryId: string;
        sellerId: string;
    }>;
    updateMedicineById: (id: string, userId: string, userRole: string, payload: any) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
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
        imageUrl: string | null;
        categoryId: string;
        sellerId: string;
    }>;
};
//# sourceMappingURL=medicien.service.d.ts.map