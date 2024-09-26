
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid';
import { Billboard } from './Billboard';

export interface category {
    _id: string;
    storeId: string;
    billboardId: string;
    name: string;
    image: string;
}

const CategorySchema = new mongoose.Schema({
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

  
export const Category = mongoose.models?.Category ||  mongoose.model('Category', CategorySchema)