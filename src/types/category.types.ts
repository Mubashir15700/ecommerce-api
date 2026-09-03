export interface CreateCategoryInput {
    name: string;
    parent?: string | null;
}

export interface UpdateCategoryInput {
    name?: string;
    parent?: string | null;
    isActive?: boolean;
}
