import { medicine } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";

const createMedicine = async (payload: medicine) => {
    const { name, description, price, stock, manufacturer, imageUrl, categoryId, sellerId,
    } = payload;

    const seller = await prisma.user.findUnique({
        where: {
            id: sellerId
        },
    });

    if (!seller) {
        throw new AppError("Seller not found", 404);
    }

    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        },
    });

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    const medicine = await prisma.medicine.create({
        data: {
            name, description, price, stock,
            manufacturer, imageUrl, categoryId, sellerId,
        },
    });

    return medicine;
};


const getAllMedicines = async () => {
    return await prisma.medicine.findMany();
};



const getMedicineById = async (id: string) => {
    return await prisma.medicine.findUniqueOrThrow({
        where: { id },
        include: {
            category: {
                select: {
                    id: true,
                    name: true
                },
            },
            seller: true,
        },
    });
};

const updateMedicineById = async (id: string, userId: string, userRole: string, payload: any) => {
    const medicine = await prisma.medicine.findFirstOrThrow({
        where: {
            id
        }
    });
    if (!medicine) throw new AppError("Medicine not found", 404);

    if (userRole !== 'ADMIN' && medicine.sellerId !== userId) {
        throw new AppError("Unauthorized! You can only update your own medicines", 403);
    }

    if (payload.price) payload.price = Number(payload.price);
    if (payload.stock) payload.stock = Number(payload.stock);

    return await prisma.medicine.update({
        where: {
            id
        },
        data: payload,
    });
};

const deleteMedicineById = async (id: string, userId: string, userRole: string) => {

    const medicine = await prisma.medicine.findUnique({
        where: {
            id
        },
    });

    if (!medicine) {
        throw new AppError("Medicine not found", 404);
    }

    if (userRole !== 'ADMIN' && medicine.sellerId !== userId) {
        throw new AppError("You can only delete your own medicines", 403);
    }

    return await prisma.medicine.delete({
        where: {
            id
        },
    });
};


export const medicineService = {
    createMedicine,
    getAllMedicines,
    getMedicineById,
    updateMedicineById,
    deleteMedicineById,
};