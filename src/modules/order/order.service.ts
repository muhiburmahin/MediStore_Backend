import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";
import { stripeClient } from "../../lib/stripe";
import { env } from "../../config/env";
import { notificationService } from "../notification/notification.service";

type CreateOrderInput = {
  items: { medicineId: string; quantity: number }[];
  shippingAddress: string;
  phone?: string;
  paymentMethod: "STRIPE" | "COD";
};

function notifyOrderPlaced(
  customerId: string,
  order: { id: string; totalAmount: number; paymentMethod: string; paymentStatus: string },
  checkoutUrl: string | null
) {
  const paymentLine =
    order.paymentMethod === "COD"
      ? "Pay with cash when your order is delivered."
      : checkoutUrl
        ? "Open your Stripe checkout link to pay online."
        : "Complete payment when you are ready.";
  void notificationService
    .create(
      customerId,
      "Order placed",
      `Order ${order.id.slice(0, 8)}… — ${order.totalAmount.toFixed(2)} BDT. ${paymentLine} Payment status: ${order.paymentStatus}.`,
      "ORDER"
    )
    .catch(() => undefined);
}

/** One notification per seller whose products appear in the order. */
function notifySellersNewOrder(
  order: {
    id: string;
    items: { quantity: number; price: number; medicine: { sellerId: string; name: string } }[];
  }
) {
  const bySeller = new Map<string, { subtotal: number; lineCount: number }>();
  for (const it of order.items) {
    const sid = it.medicine.sellerId;
    const cur = bySeller.get(sid) ?? { subtotal: 0, lineCount: 0 };
    cur.subtotal += it.price * it.quantity;
    cur.lineCount += 1;
    bySeller.set(sid, cur);
  }
  const short = order.id.slice(0, 8);
  for (const [sellerId, agg] of bySeller) {
    void notificationService
      .create(
        sellerId,
        "New order",
        `Order #${short}… includes ${agg.lineCount} line(s) of your products (your share: ৳${agg.subtotal.toFixed(2)}). Check Seller → Orders to process.`,
        "ORDER"
      )
      .catch(() => undefined);
  }
}

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
    notifyOrderPlaced(customerId, order, null);
    notifySellersNewOrder(order);
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

  notifyOrderPlaced(customerId, updated, session.url ?? null);
  notifySellersNewOrder(updated);
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

  const previousStatus = order.status;
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: status as never },
  });

  if (status === "DELIVERED" && previousStatus !== "DELIVERED") {
    void notificationService
      .create(
        order.customerId,
        "Order delivered",
        `Order #${orderId.slice(0, 8)}… has been marked as delivered. Thank you for shopping with MediStore!`,
        "ORDER"
      )
      .catch(() => undefined);
  }

  return updated;
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
