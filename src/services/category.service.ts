import { Types } from "mongoose";
import { Category } from "../models/category.model";
import { Product } from "../models/product.model";
import { AppError } from "../utils/app-error";
import { CreateCategoryInput, UpdateCategoryInput } from "../types/category.types";

export const createCategory = async ({
    name,
    parent = null,
}: CreateCategoryInput) => {
    if (parent) {
        const parentCategory = await Category.findById(parent);

        if (!parentCategory) {
            throw new AppError("Parent category not found", 404);
        }
    }

    const existingCategory = await Category.findOne({
        name,
        parent,
    });

    if (existingCategory) {
        throw new AppError(
            "Category already exists under this parent",
            409
        );
    }

    const category = await Category.create({
        name,
        parent,
    });

    return category;
};

export const getAllCategories = async () => {
    return Category.find()
        .sort({ name: 1 })
        .lean();
};

export const getCategoryTree = async () => {
    const categories = await Category.find()
        .sort({ name: 1 })
        .lean();

    type CategoryNode = (typeof categories)[number] & {
        children: CategoryNode[];
    };

    const categoryMap = new Map<string, CategoryNode>();

    categories.forEach((category) => {
        categoryMap.set(category._id.toString(), {
            ...category,
            children: [],
        });
    });

    const tree: Array<(typeof categories)[number] & { children: unknown[] }> = [];

    categories.forEach((category) => {
        const currentCategory = categoryMap.get(category._id.toString());

        if (!currentCategory) {
            return;
        }

        if (!category.parent) {
            tree.push(currentCategory);
            return;
        }

        const parentCategory = categoryMap.get(category.parent.toString());

        if (parentCategory) {
            parentCategory.children.push(currentCategory);
        }
    });

    return tree;
};

export const updateCategory = async (
    categoryId: string,
    data: UpdateCategoryInput
) => {
    const category = await Category.findById(categoryId);

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    if (data.parent !== undefined) {
        if (data.parent === categoryId) {
            throw new AppError(
                "A category cannot be its own parent",
                400
            );
        }

        if (data.parent) {
            const parentCategory = await Category.findById(data.parent);

            if (!parentCategory) {
                throw new AppError("Parent category not found", 404);
            }

            let currentParentId: string | null =
                parentCategory.parent?.toString() ?? null;

            while (currentParentId) {
                if (currentParentId === categoryId) {
                    throw new AppError(
                        "Cannot create a circular category relationship",
                        400
                    );
                }

                const ancestor = await Category.findById(currentParentId);

                if (!ancestor) {
                    break;
                }

                currentParentId = ancestor.parent?.toString() ?? null;
            }
        }

        category.parent = data.parent
            ? new Types.ObjectId(data.parent)
            : null;
    }

    if (data.name !== undefined) {
        category.name = data.name;
    }

    if (data.isActive !== undefined) {
        category.isActive = data.isActive;
    }

    const duplicateCategory = await Category.findOne({
        _id: { $ne: categoryId },
        name: category.name,
        parent: category.parent,
    });

    if (duplicateCategory) {
        throw new AppError(
            "Category already exists under this parent",
            409
        );
    }

    await category.save();

    return category;
};

export const deleteCategory = async (categoryId: string) => {
    const category = await Category.findById(categoryId);

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    const hasChildren = await Category.exists({
        parent: categoryId,
    });

    if (hasChildren) {
        throw new AppError(
            "Cannot delete a category that has child categories",
            409
        );
    }

    const hasProducts = await Product.exists({
        category: categoryId,
    });

    if (hasProducts) {
        throw new AppError(
            "Cannot delete a category that has products",
            409
        );
    }

    await Category.findByIdAndDelete(categoryId);
};
