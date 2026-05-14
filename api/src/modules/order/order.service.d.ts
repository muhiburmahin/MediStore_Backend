type CreateOrderInput = {
    items: {
        medicineId: string;
        quantity: number;
    }[];
    shippingAddress: string;
    phone?: string;
    paymentMethod: "STRIPE" | "COD";
};
export declare const orderService: {
    createOrder: (customerId: string, payload: CreateOrderInput) => Promise<{
        order: {
            items: ({
                medicine: {
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string;
                    price: number;
                    stock: number;
                    manufacturer: string;
                    images: import("../../generated/prisma/client/runtime/library").JsonValue | null;
                    categoryId: string;
                    sellerId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                price: number;
                medicineId: string;
                quantity: number;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("../../generated/prisma/client").$Enums.orderStatus;
            phone: string | null;
            customerId: string;
            paymentStatus: string;
            paymentMethod: string;
            stripeSessionId: string | null;
            trackingNumber: string | null;
            shippingAddress: string;
            totalAmount: number;
        };
        checkoutUrl: string | null;
    }>;
    getMyOrders: (customerId: string) => Promise<({
        items: ({
            medicine: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                stock: number;
                manufacturer: string;
                images: import("../../generated/prisma/client/runtime/library").JsonValue | null;
                categoryId: string;
                sellerId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            medicineId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma/client").$Enums.orderStatus;
        phone: string | null;
        customerId: string;
        paymentStatus: string;
        paymentMethod: string;
        stripeSessionId: string | null;
        trackingNumber: string | null;
        shippingAddress: string;
        totalAmount: number;
    })[]>;
    getSellerOrders: (sellerId: string) => Promise<{
        totalAmount: number;
        customer: {
            name: string;
            email: string;
        };
        items: ({
            medicine: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                stock: number;
                manufacturer: string;
                images: import("../../generated/prisma/client/runtime/library").JsonValue | null;
                categoryId: string;
                sellerId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            medicineId: string;
            quantity: number;
            orderId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma/client").$Enums.orderStatus;
        phone: string | null;
        customerId: string;
        paymentStatus: string;
        paymentMethod: string;
        stripeSessionId: string | null;
        trackingNumber: string | null;
        shippingAddress: string;
    }[]>;
    getSingleOrderById: (orderId: string, viewer?: {
        id: string;
        role: string;
    }) => Promise<{
        customer: {
            name: string;
            email: string;
        };
        items: ({
            medicine: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                stock: number;
                manufacturer: string;
                images: import("../../generated/prisma/client/runtime/library").JsonValue | null;
                categoryId: string;
                sellerId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            medicineId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma/client").$Enums.orderStatus;
        phone: string | null;
        customerId: string;
        paymentStatus: string;
        paymentMethod: string;
        stripeSessionId: string | null;
        trackingNumber: string | null;
        shippingAddress: string;
        totalAmount: number;
    }>;
    updateOrderStatus: (orderId: string, status: string, userId: string, userRole: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma/client").$Enums.orderStatus;
        phone: string | null;
        customerId: string;
        paymentStatus: string;
        paymentMethod: string;
        stripeSessionId: string | null;
        trackingNumber: string | null;
        shippingAddress: string;
        totalAmount: number;
    }>;
    deleteOrderById: (id: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma/client").$Enums.orderStatus;
        phone: string | null;
        customerId: string;
        paymentStatus: string;
        paymentMethod: string;
        stripeSessionId: string | null;
        trackingNumber: string | null;
        shippingAddress: string;
        totalAmount: number;
    }>;
    getAllOrders: () => Promise<({
        customer: {
            name: string;
            email: string;
        };
        items: ({
            medicine: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                stock: number;
                manufacturer: string;
                images: import("../../generated/prisma/client/runtime/library").JsonValue | null;
                categoryId: string;
                sellerId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            medicineId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma/client").$Enums.orderStatus;
        phone: string | null;
        customerId: string;
        paymentStatus: string;
        paymentMethod: string;
        stripeSessionId: string | null;
        trackingNumber: string | null;
        shippingAddress: string;
        totalAmount: number;
    })[]>;
};
export {};
//# sourceMappingURL=order.service.d.ts.map