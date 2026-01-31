import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";
import { prisma } from "../../lib/prisma";


const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const result = await userService.getMyProfile(userId);

        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};

//Get All Users
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.getAllUsers();

        res.status(200).json({
            success: true,
            message: "All users retrieved successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};


const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const targetId = req.params.id || req.user!.id;
        const result = await userService.updateProfile(targetId as string, req.body);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};



export const userController = {
    getMyProfile,
    getAllUsers,
    updateProfile

};