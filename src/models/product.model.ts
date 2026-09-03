import { Document, Schema, model, Types } from "mongoose";

export enum ProductStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

export interface IProduct extends Document {
    name: string;
    sku: string;
    description: string;
    price: number;
    salePrice?: number;
    stock: number;
    category: Types.ObjectId;
    status: ProductStatus;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 200,
        },

        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        salePrice: {
            type: Number,
            min: 0,
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },

        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(ProductStatus),
            default: ProductStatus.ACTIVE,
        },
    },
    {
        timestamps: true,
    }
);

productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

export const Product = model<IProduct>("Product", productSchema);
