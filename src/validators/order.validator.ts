import { body } from "express-validator";

export const createOrderValidator = [
    body("items")
        .isArray({ min: 1 })
        .withMessage("Order must contain at least one product"),

    body("items.*.product")
        .isMongoId()
        .withMessage("Product must be a valid product ID"),

    body("items.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1")
        .toInt(),
];

export const updateOrderStatusValidator = [
    body("status")
        .isIn([
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ])
        .withMessage("Invalid order status"),
];
