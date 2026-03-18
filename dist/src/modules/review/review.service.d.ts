interface ICreateReviewPayload {
    medicineId: string;
    rating: number | string;
    comment?: string;
}
export declare const reviewService: {
    createReview: (userId: string, payload: ICreateReviewPayload) => Promise<{
        id: string;
        userId: string;
        medicineId: string;
        rating: number;
        createdat: Date;
        comment: string | null;
    }>;
    getMedicineReviews: (medicineId: string) => Promise<({
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
    })[]>;
    getSingleMedicineWithAverageRating: (id: string) => Promise<{
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
    } | null>;
};
export {};
//# sourceMappingURL=review.service.d.ts.map