import { body } from "express-validator";

export const createProductValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ min: 2, max: 200 })
        .withMessage("Product name must be between 2 and 200 characters"),

    body("sku")
        .trim()
        .notEmpty()
        .withMessage("SKU is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("SKU must be between 2 and 50 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("price")
        .exists()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a non-negative number")
        .toFloat(),

    body("salePrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Sale price must be a non-negative number")
        .toFloat(),

    body("stock")
        .exists()
        .withMessage("Stock is required")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer")
        .toInt(),

    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isMongoId()
        .withMessage("Category must be a valid category ID"),

    body("status")
        .optional()
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive"),
];

export const updateProductValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage("Product name must be between 2 and 200 characters"),

    body("sku")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("SKU must be between 2 and 50 characters"),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty"),

    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a non-negative number")
        .toFloat(),

    body("salePrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Sale price must be a non-negative number")
        .toFloat(),

    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer")
        .toInt(),

    body("category")
        .optional()
        .isMongoId()
        .withMessage("Category must be a valid category ID"),

    body("status")
        .optional()
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive"),
];
