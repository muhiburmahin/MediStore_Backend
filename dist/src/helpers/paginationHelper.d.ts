export type IOptions = {
    page?: number | string;
    limit?: number | string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};
type PaginationResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
};
export declare const calculatePagination: (options: IOptions) => PaginationResult;
export declare const paginationHelpers: {
    calculatePagination: (options: IOptions) => PaginationResult;
};
export {};
//# sourceMappingURL=paginationHelper.d.ts.map