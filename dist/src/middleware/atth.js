import { auth as betterAuth } from "../lib/auth";
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers,
            });
            if (!session) {
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
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden"
                });
            }
            next();
        }
        catch (error) {
            message: error;
        }
    };
};
export default auth;
//# sourceMappingURL=atth.js.map