export declare const categoryService: {
    createCategory: (category: string, imageUrl?: string | null) => Promise<{
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllCategories: () => Promise<{
        categories: {
            id: string;
            name: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        totalCount: number;
    }>;
    deleteCategoryById: (id: string) => Promise<{
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=category.service.d.ts.map