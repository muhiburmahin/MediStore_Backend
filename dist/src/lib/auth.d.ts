export declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    trustedOrigins: string[];
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
        autoSignIn: false;
        requireEmailVerification: true;
    };
    socialProviders: {
        google: {
            prompt: "select_account";
            clientId: string;
            clientSecret: string;
        };
    };
    emailVerification: {
        sendOnSignIn: true;
        autoSignInAfterVerification: true;
        sendVerificationEmail: ({ user, url, token }: {
            user: import("better-auth").User;
            url: string;
            token: string;
        }, request: Request | undefined) => Promise<void>;
    };
}>;
//# sourceMappingURL=auth.d.ts.map