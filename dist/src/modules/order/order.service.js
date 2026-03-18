import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";
const createOrder = async (customerId, payload) => {
    const { items, shippingAddress, phone } = payload;
    return await prisma.$transaction(async (tx) => {
        let calculatedTotalAmount = 0;
        const orderItemsData = [];
        for (const item of items) {
            const med = await tx.medicine.findUnique({
                where: { id: item.medicineId }
            });
            if (!med)
                throw new AppError(`Medicine not found`, 404);
            if (med.stock < item.quantity) {
                throw new AppError(`${med.name} stock is insufficient. Available: ${med.stock}`, 400);
            }
            calculatedTotalAmount += med.price * item.quantity;
            await tx.medicine.update({
                where: { id: med.id },
                data: { stock: { decrement: item.quantity } }
            });
            orderItemsData.push({
                medicineId: med.id,
                quantity: item.quantity,
                price: med.price
            });
        }
        return await tx.order.create({
            data: {
                customerId,
                shippingAddress,
                phone,
                totalAmount: calculatedTotalAmount,
                status: "PLACED",
                items: { create: orderItemsData }
            },
            include: { items: { include: { medicine: true } } }
        });
    });
};
const getSellerOrders = async (sellerId) => {
    const orders = await prisma.order.findMany({
        where: {
            items: {
                some: {
                    medicine: { sellerId: sellerId }
                }
            }
        },
        include: {
            items: {
                where: {
                    medicine: { sellerId: sellerId }
                },
                include: { medicine: true }
            },
            customer: {
                select: { name: true, email: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    return orders.map(order => {
        const sellerOnlyTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return {
            ...order,
            totalAmount: sellerOnlyTotal
        };
    });
};
const getMyOrders = async (customerId) => {
    return await prisma.order.findMany({
        where: { customerId },
        include: { items: { include: { medicine: true } } },
        orderBy: { createdAt: 'desc' }
    });
};
const getSingleOrderById = async (orderId) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: { include: { medicine: true } },
            customer: { select: { name: true, email: true } }
        }
    });
    if (!order)
        throw new AppError("Order not found", 404);
    return order;
};
const updateOrderStatus = async (orderId, status, userId, userRole) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { medicine: true } } }
    });
    if (!order)
        throw new AppError("Order not found", 404);
    const isOwner = order.items.some(item => item.medicine.sellerId === userId);
    if (userRole !== 'ADMIN' && !isOwner) {
        throw new AppError("You don't have permission to update this order", 403);
    }
    return await prisma.order.update({
        where: { id: orderId },
        data: { status: status }
    });
};
const deleteOrderById = async (id) => {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order)
        throw new AppError("Order not found", 404);
    return await prisma.order.delete({ where: { id } });
};
const getAllOrders = async () => {
    return await prisma.order.findMany({
        include: {
            items: {
                include: { medicine: true }
            },
            customer: {
                select: { name: true, email: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};
export const orderService = {
    createOrder,
    getMyOrders,
    getSellerOrders,
    getSingleOrderById,
    updateOrderStatus,
    deleteOrderById,
    getAllOrders
};
//# sourceMappingURL=order.service.js.map