import mongoose, { Schema, Document } from 'mongoose';
import type { ICategory } from '../types/index.js';

export interface ICategoryDocument extends ICategory, Document { }

const categorySchema = new Schema<ICategoryDocument>(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search optimization
categorySchema.index({ name: 'text', description: 'text' });

export const Category = mongoose.model<ICategoryDocument>('Category', categorySchema);
