import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { User, UserRole } from "../models/user.model";
import { AppError } from "../utils/app-error";

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

interface LoginInput {
    email: string;
    password: string;
}

const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"],
};

const generateToken = (userId: string, role: UserRole): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(
        {
            userId,
            role,
        },
        secret,
        options
    );
};

export const registerUser = async ({
    name,
    email,
    password,
}: RegisterInput) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    const token = generateToken(user._id.toString(), user.role);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        },
        token,
    };
};

export const loginUser = async ({ email, password }: LoginInput) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive) {
        throw new AppError("User account is inactive", 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken(user._id.toString(), user.role);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        },
        token,
    };
};
