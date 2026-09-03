export interface CreateProductInput {
    name: string;
    sku: string;
    description: string;
    price: number;
    salePrice?: number;
    stock: number;
    category: string;
    status?: "active" | "inactive";
}

export interface GetProductsQuery {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
}

export interface UpdateProductInput {
    name?: string;
    sku?: string;
    description?: string;
    price?: number;
    salePrice?: number;
    stock?: number;
    category?: string;
    status?: "active" | "inactive";
}
