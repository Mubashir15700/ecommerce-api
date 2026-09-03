import mongoose from "mongoose";
import {
    Product,
    ProductStatus,
} from "../models/product.model";
import { Order, OrderStatus } from "../models/order.model";
import { AppError } from "../utils/app-error";
import { CreateOrderInput, UpdateOrderStatusInput } from "../types/order.types";

const allowedStatusTransitions: Record<
    OrderStatus,
    OrderStatus[]
> = {
    [OrderStatus.PENDING]: [
        OrderStatus.CONFIRMED,
        OrderStatus.CANCELLED,
    ],

    [OrderStatus.CONFIRMED]: [
        OrderStatus.PROCESSING,
        OrderStatus.CANCELLED,
    ],

    [OrderStatus.PROCESSING]: [
        OrderStatus.SHIPPED,
        OrderStatus.CANCELLED,
    ],

    [OrderStatus.SHIPPED]: [
        OrderStatus.DELIVERED,
    ],

    [OrderStatus.DELIVERED]: [],

    [OrderStatus.CANCELLED]: [],
};

export const createOrder = async (
    userId: string,
    data: CreateOrderInput
) => {
    const session = await mongoose.startSession();

    try {
        let createdOrder;

        await session.withTransaction(async () => {
            const productIds = data.items.map(
                (item) => item.product
            );

            const uniqueProductIds = new Set(productIds);

            if (uniqueProductIds.size !== productIds.length) {
                throw new AppError(
                    "A product cannot appear more than once in an order",
                    400
                );
            }

            const products = await Product.find({
                _id: { $in: productIds },
                status: ProductStatus.ACTIVE,
            }).session(session);

            if (products.length !== productIds.length) {
                throw new AppError(
                    "One or more products were not found or are inactive",
                    400
                );
            }

            const productMap = new Map(
                products.map((product) => [
                    product._id.toString(),
                    product,
                ])
            );

            const orderItems = [];
            let totalAmount = 0;

            for (const item of data.items) {
                const product = productMap.get(item.product);

                if (!product) {
                    throw new AppError(
                        `Product ${item.product} not found`,
                        404
                    );
                }

                const price =
                    product.salePrice ?? product.price;

                const subtotal = price * item.quantity;

                orderItems.push({
                    product: product._id,
                    name: product.name,
                    sku: product.sku,
                    price,
                    quantity: item.quantity,
                    subtotal,
                });

                totalAmount += subtotal;
            }

            // Atomically reduce stock
            for (const item of data.items) {
                const updatedProduct =
                    await Product.findOneAndUpdate(
                        {
                            _id: item.product,
                            status: ProductStatus.ACTIVE,
                            stock: { $gte: item.quantity },
                        },
                        {
                            $inc: {
                                stock: -item.quantity,
                            },
                        },
                        {
                            new: true,
                            session,
                        }
                    );

                if (!updatedProduct) {
                    const product = productMap.get(item.product);

                    throw new AppError(
                        `Insufficient stock for ${product?.name ?? "product"}`,
                        409
                    );
                }
            }

            const orders = await Order.create(
                [
                    {
                        user: userId,
                        items: orderItems,
                        totalAmount,
                    },
                ],
                { session }
            );

            createdOrder = orders[0];
        });

        return createdOrder;
    } finally {
        await session.endSession();
    }
};

export const getMyOrders = async (userId: string) => {
    return Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("items.product", "name sku");
};

export const getMyOrderById = async (
    userId: string,
    orderId: string
) => {
    const order = await Order.findOne({
        _id: orderId,
        user: userId,
    }).populate("items.product", "name sku");

    if (!order) {
        throw new AppError("Order not found", 404);
    }

    return order;
};

export const getAllOrders = async () => {
    return Order.find()
        .sort({ createdAt: -1 })
        .populate("user", "name email")
        .populate("items.product", "name sku");
};

export const updateOrderStatus = async (
    orderId: string,
    data: UpdateOrderStatusInput
) => {
    const session = await mongoose.startSession();

    try {
        let updatedOrder;

        await session.withTransaction(async () => {
            const order = await Order.findById(orderId).session(session);

            if (!order) {
                throw new AppError("Order not found", 404);
            }

            if (order.status === data.status) {
                throw new AppError(
                    `Order is already ${data.status}`,
                    400
                );
            }

            const allowedTransitions =
                allowedStatusTransitions[order.status];

            if (!allowedTransitions.includes(data.status)) {
                throw new AppError(
                    `Cannot change order status from ${order.status} to ${data.status}`,
                    400
                );
            }

            // Restore stock when an order is cancelled
            if (data.status === OrderStatus.CANCELLED) {
                for (const item of order.items) {
                    await Product.findByIdAndUpdate(
                        item.product,
                        {
                            $inc: {
                                stock: item.quantity,
                            },
                        },
                        {
                            session,
                        }
                    );
                }
            }

            order.status = data.status;

            await order.save({ session });

            updatedOrder = order;
        });

        return updatedOrder;
    } finally {
        await session.endSession();
    }
};
