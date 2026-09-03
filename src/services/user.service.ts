import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { AppError } from "../utils/app-error";
import { UpdateProfileInput } from "../types/user.types";

export const getMyProfile = async (userId: string) => {
    const user = await User.findById(userId).select(
        "_id name email role isActive createdAt updatedAt"
    );

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

export const updateMyProfile = async (
    userId: string,
    data: UpdateProfileInput
) => {
    const user = await User.findById(userId).select("+password");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (data.name !== undefined) {
        user.name = data.name;
    }

    if (data.email !== undefined) {
        const existingUser = await User.findOne({
            email: data.email,
            _id: { $ne: userId },
        });

        if (existingUser) {
            throw new AppError("Email is already in use", 409);
        }

        user.email = data.email;
    }

    if (data.password !== undefined) {
        user.password = await bcrypt.hash(data.password, 12);
    }

    await user.save();

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

export const getAllUsers = async () => {
    const users = await User.find()
        .select("_id name email role isActive createdAt updatedAt")
        .sort({ createdAt: -1 });

    return users;
};

export const updateUserStatus = async (
    userId: string,
    isActive: boolean
) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { isActive },
        {
            new: true,
            runValidators: true,
        }
    ).select("_id name email role isActive createdAt updatedAt");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
};
