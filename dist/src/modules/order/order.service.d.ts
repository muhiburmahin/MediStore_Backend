import { orderStatus } from "../../../generated/prisma/enums";
export declare const orderService: {
    createOrder: (customerId: string, payload: any) => Promise<{
        items: ({
            medicine: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                stock: number;
                manufacturer: string;
                imageUrl: string | null;
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
        status: orderStatus;
        phone: string | null;
        shippingAddress: string;
        totalAmount: number;
        customerId: string;
    }>;
    getMyOrders: (customerId: string) => Promise<({
        items: ({
            medicine: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                stock: number;
                manufacturer: string;
                imageUrl: string | null;
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
        status: orderStatus;
        phone: string | null;
        shippingAddress: string;
        totalAmount: number;
        customerId: string;
    })[]>;
    getSellerOrders: (sellerId: string) => Promise<({
        customer: {
            name: string;
            email: string;
        };
        items: ({
            medicine: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                stock: number;
                manufacturer: string;
                imageUrl: string | null;
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
        status: orderStatus;
        phone: string | null;
        shippingAddress: string;
        totalAmount: number;
        customerId: string;
    })[]>;
    getSingleOrderById: (orderId: string) => Promise<{
        customer: {
            name: string;
            email: string;
        };
        items: ({
            medicine: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                stock: number;
                manufacturer: string;
                imageUrl: string | null;
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
        status: orderStatus;
        phone: string | null;
        shippingAddress: string;
        totalAmount: number;
        customerId: string;
    }>;
    updateOrderStatus: (orderId: string, status: string, userId: string, userRole: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: orderStatus;
        phone: string | null;
        shippingAddress: string;
        totalAmount: number;
        customerId: string;
    }>;
    deleteOrderById: (id: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: orderStatus;
        phone: string | null;
        shippingAddress: string;
        totalAmount: number;
        customerId: string;
    }>;
};
//# sourceMappingURL=order.service.d.ts.map