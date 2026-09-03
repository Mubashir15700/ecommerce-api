import { Response } from "express";
import { getAllUsers, getMyProfile, updateMyProfile, updateUserStatus } from "../services/user.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const getProfile = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const user = await getMyProfile(req.user!.userId);

    res.status(200).json({
        success: true,
        data: user,
    });
};

export const updateProfile = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const user = await updateMyProfile(
        req.user!.userId,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user,
    });
};

export const getUsers = async (
    _req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const users = await getAllUsers();

    res.status(200).json({
        success: true,
        data: users,
    });
};

export const updateStatus = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { isActive } = req.body;

    const user = await updateUserStatus(
        req.params.id as string,
        isActive
    );

    res.status(200).json({
        success: true,
        message: `User ${isActive ? "activated" : "deactivated"} successfully`,
        data: user,
    });
};
