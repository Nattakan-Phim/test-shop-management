import mongoose, { Schema, Document } from 'mongoose';
import type { IProduct } from '../types/index.js';

export interface IProductDocument extends IProduct, Document { }

const productSchema = new Schema<IProductDocument>(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative'],
        },
        quantity: {
            type: Number,
            required: [true, 'Product quantity is required'],
            min: [0, 'Quantity cannot be negative'],
            default: 0,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
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
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ categoryId: 1 });

export const Product = mongoose.model<IProductDocument>('Product', productSchema);
