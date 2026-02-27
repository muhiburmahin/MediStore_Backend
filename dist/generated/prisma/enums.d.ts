export declare const orderStatus: {
    readonly PLACED: "PLACED";
    readonly PROCESSING: "PROCESSING";
    readonly SHIPPED: "SHIPPED";
    readonly DELIVERED: "DELIVERED";
    readonly CANCELLED: "CANCELLED";
};
export type orderStatus = (typeof orderStatus)[keyof typeof orderStatus];
export declare const Role: {
    readonly CUSTOMER: "CUSTOMER";
    readonly SELLER: "SELLER";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly BANNED: "BANNED";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
//# sourceMappingURL=enums.d.ts.map