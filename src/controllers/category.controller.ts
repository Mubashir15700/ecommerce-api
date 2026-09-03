import { Response } from "express";
import { createCategory, deleteCategory, getAllCategories, getCategoryTree, updateCategory } from "../services/category.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const create = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const category = await createCategory(req.body);

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
    });
};

export const getCategories = async (
    _req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const categories = await getAllCategories();

    res.status(200).json({
        success: true,
        data: categories,
    });
};

export const getTree = async (
    _req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const categories = await getCategoryTree();

    res.status(200).json({
        success: true,
        data: categories,
    });
};

export const update = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const category = await updateCategory(
        req.params.id as string,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
    });
};

export const remove = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    await deleteCategory(req.params.id as string);

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
    });
};
