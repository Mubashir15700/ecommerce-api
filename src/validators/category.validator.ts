import { body } from "express-validator";

export const createCategoryValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Category name must be between 2 and 100 characters"),

    body("parent")
        .optional({ nullable: true })
        .isMongoId()
        .withMessage("Parent must be a valid category ID"),
];

export const updateCategoryValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Category name must be between 2 and 100 characters"),

    body("parent")
        .optional({ nullable: true })
        .isMongoId()
        .withMessage("Parent must be a valid category ID"),

    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean")
        .toBoolean(),
];
