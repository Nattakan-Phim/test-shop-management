import { Types } from 'mongoose';
import { Product, type IProductDocument } from '../models/product.model.js';
import type { CreateProductDto, UpdateProductDto } from '../schemas/product.schema.js';
import type { PaginationQuery } from '../schemas/common.schema.js';

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalPage: number;
        totalCount: number;
    };
}

export class ProductService {
    /**
     * Get all products with pagination and optional regex search
     */
    async findAll(query: PaginationQuery): Promise<PaginatedResponse<IProductDocument>> {
        const page = Math.max(1, query.page || 1);
        const limit = Math.min(100, Math.max(1, query.limit || 10));
        const skip = (page - 1) * limit;

        // Build filter with soft delete and optional search
        const filter: Record<string, unknown> = { isDeleted: false };

        if (query.search) {
            // Use RegEx for search
            const searchRegex = new RegExp(query.search, 'i');
            filter.$or = [
                { name: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
            ];
        }

        const [data, totalItems] = await Promise.all([
            Product.find(filter)
                .populate('categoryId', 'name description')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments(filter),
        ]);

        const totalPage = Math.ceil(totalItems / limit);

        return {
            data,
            pagination: {
                page,
                pageSize: limit,
                totalPage,
                totalCount: totalItems,
            },
        };
    }

    /**
     * Get a single product by ID
     */
    async findById(id: string): Promise<IProductDocument | null> {
        return Product.findOne({ _id: id, isDeleted: false }).populate(
            'categoryId',
            'name description'
        );
    }

    /**
     * Create a new product
     */
    async create(data: CreateProductDto): Promise<IProductDocument> {
        const product = new Product({
            ...data,
            categoryId: new Types.ObjectId(data.categoryId),
        });
        return product.save();
    }

    /**
     * Update an existing product
     */
    async update(id: string, data: UpdateProductDto): Promise<IProductDocument | null> {
        const updateData: Record<string, unknown> = { ...data };

        if (data.categoryId) {
            updateData.categoryId = new Types.ObjectId(data.categoryId);
        }

        return Product.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('categoryId', 'name description');
    }

    /**
     * Soft delete a product
     */
    async softDelete(id: string): Promise<IProductDocument | null> {
        return Product.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { isDeleted: true } },
            { new: true }
        );
    }

    /**
     * Hard delete a product (permanent)
     */
    async hardDelete(id: string): Promise<IProductDocument | null> {
        return Product.findByIdAndDelete(id);
    }
}

export const productService = new ProductService();
