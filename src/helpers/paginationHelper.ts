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

export const calculatePagination = (options: IOptions): PaginationResult => {
    const page: number = Number(options.page || 1);
    const limit: number = Number(options.limit || 10);
    const skip = (page - 1) * limit;


    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};

export const paginationHelpers = {
    calculatePagination
};

