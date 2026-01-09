import { Types } from 'mongoose';

export interface PaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalPage: number;
        totalCount: number;
    };
}

export interface ICategory {
    name: string;
    description?: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IProduct {
    name: string;
    description?: string;
    price: number;
    quantity: number;
    categoryId: Types.ObjectId;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateProductDto {
    name: string;
    description?: string;
    price: number;
    quantity: number;
    categoryId: string;
}

export interface UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    categoryId?: string;
}

export interface CreateCategoryDto {
    name: string;
    description?: string;
}

export interface UpdateCategoryDto {
    name?: string;
    description?: string;
}
