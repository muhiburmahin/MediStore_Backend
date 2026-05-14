const catchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            console.log("Global Error Log:", error);
            next(error);
        }
    };
};
export default catchAsync;
//# sourceMappingURL=catchAsync.js.map