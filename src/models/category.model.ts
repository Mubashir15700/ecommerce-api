import { Schema, model, Types } from "mongoose";

export interface ICategory {
    name: string;
    parent: Types.ObjectId | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        parent: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

categorySchema.index({ parent: 1 });

export const Category = model<ICategory>("Category", categorySchema);
