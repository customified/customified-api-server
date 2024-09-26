import mongoose from 'mongoose'

export interface Store {
    _id: string;
    name: string;
    admin: string;
}

const StoreSchema =new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    admin:{
        type: String,
        required: true
    }
},
{
    timestamps: true 
}) 


export const Stores = mongoose.models?.Stores || mongoose.model('Stores' , StoreSchema)