import { Category, type ICategoryDocument } from '../models/category.model.js';
import type { CreateCategoryDto, UpdateCategoryDto } from '../schemas/category.schema.js';
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

export class CategoryService {
    /**
     * Get all categories with pagination and optional regex search
     */
    async findAll(query: PaginationQuery): Promise<PaginatedResponse<ICategoryDocument>> {
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
            Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Category.countDocuments(filter),
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
     * Get a single category by ID
     */
    async findById(id: string): Promise<ICategoryDocument | null> {
        return Category.findOne({ _id: id, isDeleted: false });
    }

    /**
     * Create a new category
     */
    async create(data: CreateCategoryDto): Promise<ICategoryDocument> {
        const category = new Category(data);
        return category.save();
    }

    /**
     * Update an existing category
     */
    async update(id: string, data: UpdateCategoryDto): Promise<ICategoryDocument | null> {
        return Category.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: data },
            { new: true, runValidators: true }
        );
    }

    /**
     * Soft delete a category
     */
    async softDelete(id: string): Promise<ICategoryDocument | null> {
        return Category.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { isDeleted: true } },
            { new: true }
        );
    }

    /**
     * Hard delete a category (permanent)
     */
    async hardDelete(id: string): Promise<ICategoryDocument | null> {
        return Category.findByIdAndDelete(id);
    }
}

export const categoryService = new CategoryService();
