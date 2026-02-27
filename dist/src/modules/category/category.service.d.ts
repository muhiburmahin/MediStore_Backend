export declare const categoryService: {
    createCategory: (category: string) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllCategories: () => Promise<{
        categories: ({
            medicines: {
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
            }[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
        totalCount: number;
    }>;
    deleteCategoryById: (id: string) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=category.service.d.ts.map