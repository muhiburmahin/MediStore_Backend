import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";
const listForUser = async (userId) => {
    return prisma.wishlist.findMany({
        where: { userId },
        include: {
            medicine: {
                include: { category: { select: { id: true, name: true } } },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};
const add = async (userId, medicineId) => {
    const med = await prisma.medicine.findUnique({ where: { id: medicineId } });
    if (!med)
        throw new AppError("Medicine not found", 404);
    try {
        return await prisma.wishlist.create({
            data: { userId, medicineId },
            include: { medicine: true },
        });
    }
    catch {
        throw new AppError("Item is already in your wishlist", 409);
    }
};
const removeByMedicineId = async (userId, medicineId) => {
    const deleted = await prisma.wishlist.deleteMany({
        where: { userId, medicineId },
    });
    if (deleted.count === 0)
        throw new AppError("Wishlist item not found", 404);
    return { removed: true };
};
const removeById = async (userId, id) => {
    const row = await prisma.wishlist.findFirst({ where: { id, userId } });
    if (!row)
        throw new AppError("Wishlist item not found", 404);
    await prisma.wishlist.delete({ where: { id } });
    return { removed: true };
};
const toggle = async (userId, medicineId) => {
    const med = await prisma.medicine.findUnique({ where: { id: medicineId } });
    if (!med)
        throw new AppError("Medicine not found", 404);
    const existing = await prisma.wishlist.findFirst({
        where: { userId, medicineId },
    });
    if (existing) {
        await prisma.wishlist.delete({ where: { id: existing.id } });
        return { inWishlist: false };
    }
    await prisma.wishlist.create({ data: { userId, medicineId } });
    return { inWishlist: true };
};
export const wishlistService = {
    listForUser,
    add,
    removeByMedicineId,
    removeById,
    toggle,
};
//# sourceMappingURL=wishlist.service.js.map