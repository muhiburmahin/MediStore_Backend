import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";
const listForUser = async (userId, unreadOnly) => {
    return prisma.notification.findMany({
        where: {
            userId,
            ...(unreadOnly ? { isRead: false } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: 100,
    });
};
const markRead = async (userId, id) => {
    const row = await prisma.notification.findFirst({ where: { id, userId } });
    if (!row)
        throw new AppError("Notification not found", 404);
    return prisma.notification.update({
        where: { id },
        data: { isRead: true },
    });
};
const markAllRead = async (userId) => {
    await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });
    return { updated: true };
};
export const notificationService = {
    listForUser,
    markRead,
    markAllRead,
};
//# sourceMappingURL=notification.service.js.map