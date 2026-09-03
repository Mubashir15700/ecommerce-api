import { Response } from "express";
import { createOrder, getAllOrders, getMyOrderById, getMyOrders, updateOrderStatus } from "../services/order.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const create = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const order = await createOrder(
        req.user!.userId,
        req.body
    );

    res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
    });
};

export const getMine = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const orders = await getMyOrders(req.user!.userId);

    res.status(200).json({
        success: true,
        data: orders,
    });
};

export const getMineById = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const order = await getMyOrderById(
        req.user!.userId,
        req.params.id as string
    );

    res.status(200).json({
        success: true,
        data: order,
    });
};

export const getAll = async (
    _req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const orders = await getAllOrders();

    res.status(200).json({
        success: true,
        data: orders,
    });
};

export const updateStatus = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const order = await updateOrderStatus(
        req.params.id as string,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: order,
    });
};
