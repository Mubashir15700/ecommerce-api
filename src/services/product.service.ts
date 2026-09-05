import mongoose from "mongoose";
import { Product } from "../models/product.model";
import { Category } from "../models/category.model";
import { AppError } from "../utils/app-error";
import { CreateProductInput, GetProductsQuery, UpdateProductInput } from "../types/product.types";

const getDescendantCategoryIds = async (
    categoryId: string
): Promise<string[]> => {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new AppError("Invalid category ID", 400);
    }

    const result = await Category.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(categoryId),
            },
        },

        {
            // selected category
            //      ↓
            // its children
            //      ↓
            // grandchildren
            //      ↓
            // great-grandchildren
            //      ↓
            // ...
            $graphLookup: {
                from: "categories",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parent",
                as: "descendants",
            },
        },

        {
            $project: {
                categoryIds: {
                    $concatArrays: [
                        ["$_id"],
                        "$descendants._id",
                    ],
                },
            },
        },
    ]);

    if (result.length === 0) {
        throw new AppError("Category not found", 404);
    }

    return result[0].categoryIds.map(
        (id: mongoose.Types.ObjectId) => id.toString()
    );
};

export const createProduct = async (data: CreateProductInput) => {
    if (
        data.salePrice !== undefined &&
        data.salePrice > data.price
    ) {
        throw new AppError(
            "Sale price cannot be greater than price",
            400
        );
    }

    const category = await Category.findById(data.category);

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    if (!category.isActive) {
        throw new AppError(
            "Cannot create a product under an inactive category",
            400
        );
    }

    const existingProduct = await Product.findOne({
        sku: data.sku,
    });

    if (existingProduct) {
        throw new AppError("Product with this SKU already exists", 409);
    }

    const product = await Product.create(data as any);

    return product;
};

export const getProducts = async (query: GetProductsQuery) => {
    const {
        search,
        category,
        minPrice,
        maxPrice,
        sort = "newest",
        page = 1,
        limit = 10,
    } = query;

    const filter: Record<string, unknown> = {
        status: "active",
    };

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { sku: { $regex: search, $options: "i" } },
        ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        const priceFilter: Record<string, number> = {};

        if (minPrice !== undefined) {
            priceFilter.$gte = minPrice;
        }

        if (maxPrice !== undefined) {
            priceFilter.$lte = maxPrice;
        }

        filter.price = priceFilter;
    }

    if (category) {
        const categoryIds = await getDescendantCategoryIds(category);

        filter.category = {
            $in: categoryIds,
        };
    }

    const sortOptions: Record<string, 1 | -1> = {};

    switch (sort) {
        case "price_asc":
            sortOptions.price = 1;
            break;

        case "price_desc":
            sortOptions.price = -1;
            break;

        case "name_asc":
            sortOptions.name = 1;
            break;

        case "name_desc":
            sortOptions.name = -1;
            break;

        case "newest":
        default:
            sortOptions.createdAt = -1;
            break;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        Product.find(filter)
            .populate("category", "name parent")
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean(),

        Product.countDocuments(filter),
    ]);

    return {
        products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getProductById = async (productId: string) => {
    const product = await Product.findById(productId)
        .populate("category", "name parent")
        .lean();

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    return product;
};

export const updateProduct = async (
    productId: string,
    data: UpdateProductInput
) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    const newPrice = data.price ?? product.price;
    const newSalePrice =
        data.salePrice !== undefined
            ? data.salePrice
            : product.salePrice;

    if (
        newSalePrice !== undefined &&
        newSalePrice > newPrice
    ) {
        throw new AppError(
            "Sale price cannot be greater than price",
            400
        );
    }

    if (data.sku !== undefined && data.sku !== product.sku) {
        const existingProduct = await Product.findOne({
            sku: data.sku,
            _id: { $ne: productId },
        });

        if (existingProduct) {
            throw new AppError(
                "Product with this SKU already exists",
                409
            );
        }
    }

    if (data.category !== undefined) {
        const category = await Category.findById(data.category);

        if (!category) {
            throw new AppError("Category not found", 404);
        }

        if (!category.isActive) {
            throw new AppError(
                "Cannot assign product to an inactive category",
                400
            );
        }
    }

    Object.assign(product, data);

    await product.save();

    return product;
};

export const deleteProduct = async (productId: string) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    await Product.findByIdAndDelete(productId);
};
