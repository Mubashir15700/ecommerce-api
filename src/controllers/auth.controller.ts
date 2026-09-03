import { Request, Response } from "express";
import {
    loginUser,
    registerUser,
} from "../services/auth.service";

export const register = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { name, email, password } = req.body;

    const result = await registerUser({
        name,
        email,
        password,
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
    });
};

export const login = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { email, password } = req.body;

    const result = await loginUser({
        email,
        password,
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
    });
};
