export declare const notificationService: {
    listForUser: (userId: string, unreadOnly?: boolean) => Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: string;
        message: string;
        title: string;
        isRead: boolean;
    }[]>;
    markRead: (userId: string, id: string) => Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: string;
        message: string;
        title: string;
        isRead: boolean;
    }>;
    markAllRead: (userId: string) => Promise<{
        updated: boolean;
    }>;
};
//# sourceMappingURL=notification.service.d.ts.map