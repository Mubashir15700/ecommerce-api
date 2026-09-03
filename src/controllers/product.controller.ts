import { Response } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../services/product.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const create = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const product = await createProduct(req.body);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
    });
};

export const getAll = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const result = await getProducts({
        search: req.query.search as string | undefined,
        category: req.query.category as string | undefined,
        minPrice: req.query.minPrice
            ? Number(req.query.minPrice)
            : undefined,
        maxPrice: req.query.maxPrice
            ? Number(req.query.maxPrice)
            : undefined,
        sort: req.query.sort as string | undefined,
        page: req.query.page
            ? Number(req.query.page)
            : 1,
        limit: req.query.limit
            ? Number(req.query.limit)
            : 10,
    });

    res.status(200).json({
        success: true,
        data: result,
    });
};

export const getOne = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const product = await getProductById(req.params.id as string);

    res.status(200).json({
        success: true,
        data: product,
    });
};

export const update = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const product = await updateProduct(
        req.params.id as string,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
    });
};

export const remove = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    await deleteProduct(req.params.id as string);

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
};
