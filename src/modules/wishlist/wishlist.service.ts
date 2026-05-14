import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";
import { notificationService } from "../notification/notification.service";

const listForUser = async (userId: string) => {
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

const add = async (userId: string, medicineId: string) => {
  const med = await prisma.medicine.findUnique({ where: { id: medicineId } });
  if (!med) throw new AppError("Medicine not found", 404);
  try {
    const row = await prisma.wishlist.create({
      data: { userId, medicineId },
      include: { medicine: true },
    });
    void notificationService
      .create(userId, "Wishlist", `${med.name} was added to your wishlist.`, "WISHLIST")
      .catch(() => undefined);
    return row;
  } catch {
    throw new AppError("Item is already in your wishlist", 409);
  }
};

const removeByMedicineId = async (userId: string, medicineId: string) => {
  const deleted = await prisma.wishlist.deleteMany({
    where: { userId, medicineId },
  });
  if (deleted.count === 0) throw new AppError("Wishlist item not found", 404);
  return { removed: true };
};

const removeById = async (userId: string, id: string) => {
  const row = await prisma.wishlist.findFirst({ where: { id, userId } });
  if (!row) throw new AppError("Wishlist item not found", 404);
  await prisma.wishlist.delete({ where: { id } });
  return { removed: true };
};

const toggle = async (userId: string, medicineId: string) => {
  const med = await prisma.medicine.findUnique({ where: { id: medicineId } });
  if (!med) throw new AppError("Medicine not found", 404);

  const existing = await prisma.wishlist.findFirst({
    where: { userId, medicineId },
  });
  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return { inWishlist: false };
  }
  await prisma.wishlist.create({ data: { userId, medicineId } });
  void notificationService
    .create(userId, "Wishlist", `${med.name} was added to your wishlist.`, "WISHLIST")
    .catch(() => undefined);
  return { inWishlist: true };
};

export const wishlistService = {
  listForUser,
  add,
  removeByMedicineId,
  removeById,
  toggle,
};
