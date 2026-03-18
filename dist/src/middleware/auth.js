import { auth as betterAuth } from "../lib/auth";
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers,
            });
            if (!session || !session.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized Access"
                });
            }
            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Email verification required"
                });
            }
            req.user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role,
                emailVerified: session.user.emailVerified,
            };
            if (roles.length > 0 && !roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You do not have permission"
                });
            }
            next();
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    };
};
export default auth;
//# sourceMappingURL=auth.js.map