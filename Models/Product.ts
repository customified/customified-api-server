import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { category } from './Category';
import { ICustomization } from './Customization';
import { IUpgrade } from './Upgrade';
import { IDeliveryCost } from './Delivery';
import { IIndustry } from './Industry';

import { Billboard } from '@/Models/Billboard'; 
import { Category } from "@/Models/Category"
import { Industry } from "@/Models/Industry"
import { Customization } from "@/Models/Customization"
import { Upgrade } from "@/Models/Upgrade"
import { DeliveryCost } from "@/Models/Delivery"

export interface IProduct {
    _id: string;
    category: category;
    description? : string;
    industries?: IIndustry[];
    additionalCategories?: string[];
    name: string;
    isFeatured: boolean;
    isArchived: boolean;
    customizations: ICustomization[];
    images: string[];  
    upgrades: IUpgrade[];
    stock: number;
    deliveryCosts: IDeliveryCost;
    createdAt: string;
    storeId: string;
}

const ProductSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    category: {
        type: String,
        ref: Category,
        required: true
    },
    description: {
        type: String,
    },
    industries: [{
        type: String,
        ref: Industry,
        required: true
    }],
    additionalCategories: [{
        type: String,
    }],
    name: {
        type: String,
        required: true
    },
    isFeatured: {
        type: Boolean,
        required: true
    },
    isArchived: {
        type: Boolean,
        required: true
    },
    customizations: [{
        type: String,
        ref: Customization
    }],
    images: [{
        type: String,
        required: true
    }],
    upgrades: [{
        type: String,
        ref: Upgrade,
        required: true
    }],
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    deliveryCosts: {
        type: String,
        ref: DeliveryCost,
        required: true
  
      },
      storeId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


export const Product = mongoose.models?.Product || mongoose.model('Product', ProductSchema);
