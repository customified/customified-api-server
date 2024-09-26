import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ICustomizationOption {
    _id: string;
    name: string;
    value?: string;
    mediaUrl?: string;
    prices?: { min: string; max: string; price: string }[];
}

export interface ICustomization {
    _id: string;
    name: string;
    type: string;
    options?: ICustomizationOption[];
    storeId: string;  
    createdAt: Date; 
}

const CustomizationOptionSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
    },
    mediaUrl: {
        type: String
    },
    prices: [{
        min: {
            type: String,
            required: true
        },
        max: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        }
    }]
});

const CustomizationSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    options: [CustomizationOptionSchema],
    storeId: {
        type: String,
        ref: 'Store',
        required: true
    }
}, {
    timestamps: true
});

export const Customization = mongoose.models?.Customization ||  mongoose.model('Customization', CustomizationSchema);

