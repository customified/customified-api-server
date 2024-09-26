
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid';

export interface billboard {
    _id: string;
    storeId: string;
    label: string;
    imageUrl: string;
}

const BillboardSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    storeId: {
        type: String,
        ref: 'Stores',
        required: true
    },
    label: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)

export const Billboard = mongoose.models?.Billboard || mongoose.model('Billboard', BillboardSchema) 