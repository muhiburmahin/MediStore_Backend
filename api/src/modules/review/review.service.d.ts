interface ICreateReviewPayload {
    medicineId: string;
    rating: number | string;
    comment?: string;
}
export declare const reviewService: {
    createReview: (userId: string, payload: ICreateReviewPayload) => Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        medicineId: string;
        rating: number;
        comment: string | null;
    }>;
    getMedicineReviews: (medicineId: string) => Promise<({
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
    })[]>;
    getSingleMedicineWithAverageRating: (id: string) => Promise<{
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
        images: import("../../generated/prisma/client/runtime/library").JsonValue | null;
        categoryId: string;
        sellerId: string;
    } | null>;
};
export {};
//# sourceMappingURL=review.service.d.ts.map