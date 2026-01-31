import { prisma } from "../../lib/prisma";

const getMyProfile = async (userId: string) => {
    return await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            role: true
        }
    });
};

//Get all users
const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            image: true,
            createdAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};


const updateProfile = async (userId: string, payload: any) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!isUserExist) {
        throw new Error("User not found!");
    }

    // update 
    return await prisma.user.update({
        where: { id: userId },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            role: true
        }
    });
};


export const userService = {
    getMyProfile,
    getAllUsers,
    updateProfile

};