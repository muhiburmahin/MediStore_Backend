import { notificationService } from "./notification.service";
const list = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const unreadOnly = req.query.unread === "true";
        const data = await notificationService.listForUser(userId, unreadOnly);
        res.status(200).json({ success: true, message: "Notifications fetched", data });
    }
    catch (e) {
        next(e);
    }
};
const markRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const data = await notificationService.markRead(userId, id);
        res.status(200).json({ success: true, message: "Marked as read", data });
    }
    catch (e) {
        next(e);
    }
};
const markAllRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await notificationService.markAllRead(userId);
        res.status(200).json({ success: true, message: "All notifications marked read", data });
    }
    catch (e) {
        next(e);
    }
};
export const notificationController = {
    list,
    markRead,
    markAllRead,
};
//# sourceMappingURL=notification.controller.js.map