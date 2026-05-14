export declare const auth: import("better-auth").Auth<{
    emailVerification: {
        sendOnSignIn: false;
        autoSignInAfterVerification: true;
        sendVerificationEmail: ({ user, url }: {
            user: import("better-auth").User;
            url: string;
            token: string;
        }) => Promise<void>;
    };
    socialProviders?: {
        google: {
            prompt: "select_account";
            clientId: string;
            clientSecret: string;
        };
    };
    secret: string;
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    baseURL: string;
    trustedOrigins: string[];
    session: {
        cookieCache: {
            enabled: true;
            maxAge: number;
        };
    };
    advanced: {
        cookiePrefix: string;
        useSecureCookies: boolean;
        crossSubDomainCookies: {
            enabled: false;
        };
        disableCSRFCheck: true;
    };
    user: {
        additionalFields: {
            role: {
                type: "string";
                defaultValue: "CUSTOMER";
                required: true;
                allowedValues: ("CUSTOMER" | "SELLER" | "ADMIN")[];
            };
            status: {
                type: "string";
                defaultValue: "ACTIVE";
                required: true;
                allowedValues: ("ACTIVE" | "BANNED")[];
            };
            phone: {
                type: "string";
                required: false;
            };
        };
    };
    emailAndPassword: {
        enabled: true;
        autoSignIn: true;
        requireEmailVerification: false;
        sendResetPassword: ({ user, url }: {
            user: import("better-auth").User;
            url: string;
            token: string;
        }) => Promise<void>;
    };
}>;
//# sourceMappingURL=auth.d.ts.map