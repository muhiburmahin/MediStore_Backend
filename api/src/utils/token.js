import jwt from "jsonwebtoken";
import { env } from "../config/env";
function requireSecret(name, label) {
    const v = env[name];
    if (!v)
        throw new Error(`${label} is not configured`);
    return v;
}
export const tokenUtils = {
    getAccessToken(payload) {
        const secret = requireSecret("JWT_ACCESS_SECRET", "JWT_ACCESS_SECRET");
        return jwt.sign(payload, secret, {
            expiresIn: env.JWT_ACCESS_EXPIRES_IN,
        });
    },
    getRefreshToken(payload) {
        const secret = requireSecret("JWT_REFRESH_SECRET", "JWT_REFRESH_SECRET");
        return jwt.sign(payload, secret, {
            expiresIn: env.JWT_REFRESH_EXPIRES_IN,
        });
    },
};
//# sourceMappingURL=token.js.map