import { body } from "express-validator";

export const updateProfileValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),

    body("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

export const updateUserStatusValidator = [
    body("isActive")
        .exists()
        .withMessage("isActive is required")
        .isBoolean()
        .withMessage("isActive must be a boolean")
        .toBoolean(),
];
