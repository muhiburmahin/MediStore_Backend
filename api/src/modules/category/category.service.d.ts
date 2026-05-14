export declare const categoryService: {
    createCategory: (category: string, imageUrl?: string | null) => Promise<{
        name: string;
        id: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllCategories: () => Promise<{
        categories: {
            name: string;
            id: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        totalCount: number;
    }>;
    deleteCategoryById: (id: string) => Promise<{
        name: string;
        id: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=category.service.d.ts.map