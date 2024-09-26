import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUpgrade {
    _id: string;
    name: string;
    mediaUrl: string;
    category: string;
    priceTiers: { min: string; max: string; price: string }[];
    storeId: string;
    createdAt: Date;
}

const UpgradeSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    mediaUrl: {
        type: String,
        required: true
    },
    priceTiers: [{
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
    }],
    storeId: {
        type: String,
        required: true
    },
    category: {
        type: String,
        ref: 'Category',
        required: true
    }

}, {
    timestamps: true
});


export const Upgrade = mongoose.models?.Upgrade || mongoose.model('Upgrade', UpgradeSchema);
