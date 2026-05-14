import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";
import { stripeClient } from "../../lib/stripe";
import { env } from "../../config/env";

type CreateOrderInput = {
  items: { medicineId: string; quantity: number }[];
  shippingAddress: string;
  phone?: string;
  paymentMethod: "STRIPE" | "COD";
};

const createOrder = async (customerId: string, payload: CreateOrderInput) => {
  const { items, shippingAddress, phone, paymentMethod } = payload;

  const order = await prisma.$transaction(async (tx) => {
    let calculatedTotalAmount = 0;
    const orderItemsData: { medicineId: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      const med = await tx.medicine.findUnique({
        where: { id: item.medicineId },
      });

      if (!med) throw new AppError(`Medicine not found`, 404);
      if (med.stock < item.quantity) {
        throw new AppError(`${med.name} stock is insufficient. Available: ${med.stock}`, 400);
      }

      calculatedTotalAmount += med.price * item.quantity;

      await tx.medicine.update({
        where: { id: med.id },
        data: { stock: { decrement: item.quantity } },
      });

      orderItemsData.push({
        medicineId: med.id,
        quantity: item.quantity,
        price: med.price,
      });
    }

    return tx.order.create({
      data: {
        customerId,
        shippingAddress,
        phone: phone ?? null,
        totalAmount: calculatedTotalAmount,
        status: "PLACED",
        paymentMethod,
        paymentStatus: "PENDING",
        items: { create: orderItemsData },
      },
      include: { items: { include: { medicine: true } } },
    });
  });

  if (paymentMethod === "COD") {
    return { order, checkoutUrl: null as string | null };
  }

  if (!stripeClient) {
    throw new AppError("Stripe is not configured on the server", 500);
  }

  const currency = (process.env.STRIPE_CURRENCY ?? "usd").toLowerCase();
  const line_items = order.items.map((it) => ({
    quantity: it.quantity,
    price_data: {
      currency,
      unit_amount: Math.round(it.price * 100),
      product_data: {
        name: it.medicine.name,
      },
    },
  }));

  const session = await stripeClient.checkout.sessions.create({
    mode: "payment",
    metadata: { orderId: order.id },
    success_url: `${env.FRONTEND_URL.replace(/\/$/, "")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.FRONTEND_URL.replace(/\/$/, "")}/checkout/cancel?orderId=${order.id}`,
    line_items,
  });

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
    include: { items: { include: { medicine: true } } },
  });

  return { order: updated, checkoutUrl: session.url };
};

const getSellerOrders = async (sellerId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: { sellerId: sellerId },
        },
      },
    },
    include: {
      items: {
        where: {
          medicine: { sellerId: sellerId },
        },
        include: { medicine: true },
      },
      customer: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((o) => {
    const sellerOnlyTotal = o.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      ...o,
      totalAmount: sellerOnlyTotal,
    };
  });
};

const getMyOrders = async (customerId: string) => {
  return prisma.order.findMany({
    where: { customerId },
    include: { items: { include: { medicine: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const getSingleOrderById = async (orderId: string, viewer?: { id: string; role: string }) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { medicine: true } },
      customer: { select: { name: true, email: true } },
    },
  });
  if (!order) throw new AppError("Order not found", 404);

  if (viewer) {
    if (viewer.role === "ADMIN") return order;
    if (order.customerId === viewer.id) return order;
    if (viewer.role === "SELLER") {
      const owns = order.items.some((i) => i.medicine.sellerId === viewer.id);
      if (owns) return order;
    }
    throw new AppError("Forbidden", 403);
  }

  return order;
};

const updateOrderStatus = async (orderId: string, status: string, userId: string, userRole: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { medicine: true } } },
  });

  if (!order) throw new AppError("Order not found", 404);

  const isOwner = order.items.some((item) => item.medicine.sellerId === userId);

  if (userRole !== "ADMIN" && !isOwner) {
    throw new AppError("You don't have permission to update this order", 403);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: status as never },
  });
};

const deleteOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new AppError("Order not found", 404);
  return prisma.order.delete({ where: { id } });
};

const getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      items: {
        include: { medicine: true },
      },
      customer: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const orderService = {
  createOrder,
  getMyOrders,
  getSellerOrders,
  getSingleOrderById,
  updateOrderStatus,
  deleteOrderById,
  getAllOrders,
};
