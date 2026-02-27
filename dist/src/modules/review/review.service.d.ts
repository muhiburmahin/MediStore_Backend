export declare const getSingleMedicineWithAverageRating: (id: string) => Promise<{
    averageRating: number;
    totalReviews: number;
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
        comment: string | null;
        rating: number;
        medicineId: string;
        createdat: Date;
    })[];
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
} | null>;
export declare const reviewService: {
    createReview: (userId: string, payload: any) => Promise<{
        id: string;
        userId: string;
        comment: string | null;
        rating: number;
        medicineId: string;
        createdat: Date;
    }>;
    getMedicineReviews: (medicineId: string) => Promise<({
        user: {
            name: string;
            image: string | null;
        };
    } & {
        id: string;
        userId: string;
        comment: string | null;
        rating: number;
        medicineId: string;
        createdat: Date;
    })[]>;
    getSingleMedicineWithAverageRating: (id: string) => Promise<{
        averageRating: number;
        totalReviews: number;
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
            comment: string | null;
            rating: number;
            medicineId: string;
            createdat: Date;
        })[];
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
    } | null>;
};
//# sourceMappingURL=review.service.d.ts.map