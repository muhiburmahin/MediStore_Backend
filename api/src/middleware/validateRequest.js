import { ZodError } from "zod/v3";
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = (await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            }));
            if (parsed.body !== undefined)
                req.body = parsed.body;
            if (parsed.query !== undefined)
                req.query = parsed.query;
            if (parsed.params !== undefined)
                req.params = parsed.params;
            next();
        }
        catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: err.flatten(),
                });
            }
            next(err);
        }
    };
};
export default validateRequest;
//# sourceMappingURL=validateRequest.js.map