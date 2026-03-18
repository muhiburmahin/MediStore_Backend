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
                images: string[];
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
        customerId: string;
        shippingAddress: string;
        totalAmount: number;
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
                images: string[];
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
        customerId: string;
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
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                stock: number;
                manufacturer: string;
                images: string[];
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
        status: orderStatus;
        phone: string | null;
        customerId: string;
        shippingAddress: string;
    }[]>;
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
                images: string[];
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
        customerId: string;
        shippingAddress: string;
        totalAmount: number;
    }>;
    updateOrderStatus: (orderId: string, status: string, userId: string, userRole: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: orderStatus;
        phone: string | null;
        customerId: string;
        shippingAddress: string;
        totalAmount: number;
    }>;
    deleteOrderById: (id: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: orderStatus;
        phone: string | null;
        customerId: string;
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
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                stock: number;
                manufacturer: string;
                images: string[];
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
        customerId: string;
        shippingAddress: string;
        totalAmount: number;
    })[]>;
};
//# sourceMappingURL=order.service.d.ts.map