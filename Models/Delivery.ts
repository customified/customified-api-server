import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IDeliveryCostTier {
  min: string;
  max: string;
  price: string;
}

export interface IDeliveryCost {
  _id: string;
  category: string;
  priceTiers: IDeliveryCostTier[];
  createdAt: Date;
}

const DeliveryCostTierSchema = new mongoose.Schema({
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
});

const DeliveryCostSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  category: {
    type: String,
    ref: 'Category',
    required: true
  },
  storeId: {
    type: String,
    required: true
},
  priceTiers: [DeliveryCostTierSchema]  
},
 {
  timestamps: true
});


export const DeliveryCost = mongoose.models?.DeliveryCost || mongoose.model('DeliveryCost', DeliveryCostSchema);
