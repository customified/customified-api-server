import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { Billboard } from '@/Models/Billboard'; 


export interface IIndustry {
    _id: string;
    storeId: string;
    billboardId: string;
    name: string;
    image: string;
}


const IndustrySchema = new mongoose.Schema({
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
    billboardId: {
        type: String,
        ref: Billboard,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }

},
    {
        timestamps: true
    }
)

export const Industry = mongoose.models?.Industry || mongoose.model('Industry', IndustrySchema)  
