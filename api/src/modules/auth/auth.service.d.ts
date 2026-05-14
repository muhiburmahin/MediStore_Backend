import type { Request } from "express";
import { ILoginUserPayload, IRegisterUserPayload } from "./auth.interface";
export declare const AuthService: {
    registerUser: (req: Request, payload: IRegisterUserPayload) => Promise<{
        webRes: Response;
        data: any;
    }>;
    loginUser: (req: Request, payload: ILoginUserPayload) => Promise<{
        webRes: Response;
        data: {
            user?: {
                id: string;
                email: string;
                role?: string;
            };
            token?: string;
        } | null;
        jwtPair: {
            accessToken: string;
            refreshToken: string;
        } | undefined;
    }>;
    requestPasswordReset: (req: Request, email: string, redirectTo?: string) => Promise<any>;
    resetPasswordWithToken: (req: Request, token: string, newPassword: string) => Promise<any>;
    changePassword: (req: Request, currentPassword: string, newPassword: string) => Promise<any>;
    refreshToken: (token: string) => Promise<{
        accessToken: string;
    }>;
    getMe: (userId: string) => Promise<{
        name: string;
        id: string;
        createdAt: Date;
        role: import("../../generated/prisma/client").$Enums.Role;
        status: import("../../generated/prisma/client").$Enums.UserStatus;
        phone: string | null;
        email: string;
        emailVerified: boolean;
        image: string | null;
    }>;
    googleLoginSuccess: (session: {
        user: {
            id: string;
            email: string;
            role?: string;
        };
    }) => Promise<{
        accessToken: string;
        refreshToken: string;
    } | undefined>;
    logoutUser: (req: Request) => Promise<Response>;
};
//# sourceMappingURL=auth.service.d.ts.map