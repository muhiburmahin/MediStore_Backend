import { Role } from "../generated/prisma/client";
export type JwtPayload = {
    id: string;
    email: string;
    role: Role;
};
export declare const tokenUtils: {
    getAccessToken(payload: JwtPayload): string;
    getRefreshToken(payload: JwtPayload): string;
};
//# sourceMappingURL=token.d.ts.map