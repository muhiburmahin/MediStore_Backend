export declare const wishlistService: {
    listForUser: (userId: string) => Promise<({
        medicine: {
            category: {
                name: string;
                id: string;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            price: number;
            stock: number;
            manufacturer: string;
            images: import("../../generated/prisma/client/runtime/library").JsonValue | null;
            categoryId: string;
            sellerId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        medicineId: string;
    })[]>;
    add: (userId: string, medicineId: string) => Promise<{
        medicine: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            price: number;
            stock: number;
            manufacturer: string;
            images: import("../../generated/prisma/client/runtime/library").JsonValue | null;
            categoryId: string;
            sellerId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        medicineId: string;
    }>;
    removeByMedicineId: (userId: string, medicineId: string) => Promise<{
        removed: boolean;
    }>;
    removeById: (userId: string, id: string) => Promise<{
        removed: boolean;
    }>;
    toggle: (userId: string, medicineId: string) => Promise<{
        inWishlist: boolean;
    }>;
};
//# sourceMappingURL=wishlist.service.d.ts.map