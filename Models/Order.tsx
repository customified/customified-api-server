import mongoose, { Schema, Document } from 'mongoose';
import { IUpgrade } from './Upgrade';

export interface IOrder extends Document {
  _id: string;
  storeId: string;
  isPaid: boolean;
  username: string;
  useremail: string;
  address: string;
  phone: string;
  status: string;
  createdAt : string;
  orderItems: Array<{
    product: {
      id: string;
      name: string;
      image: string;
      category: string | null;
      quantity: number;
      productSize: string | undefined;
      quantities: { [key: string]: number };
      upgrades: { [key: string]: IUpgrade };
      unitCost: number | string;
      totalCost: number;
      orderNote: string;
      design?: {
        front: {
            userdesign : string | null;
            textproperties: Array<{ text: string; fontFamily: string; fill: string }> | null;
            imagesInDesign: string[] | null;
        } | null ,
        back: {
            userdesign : string | null;
            textproperties:  Array<{ text: string; fontFamily: string; fill: string }> | null;
            imagesInDesign: string[] | null;
        } | null
    }
    }
  }>;

}

const DesignSchema = new Schema({
  userdesign: { type: String, default: null },
  textproperties: [{
    text: { type: String },
    fontFamily: { type: String },
    fill: { type: String},
  }],
  imagesInDesign: { type: [String], default: null },
}, { _id: false });

const OrderSchema: Schema = new Schema({
  storeId: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  username: { type: String, required: true },
  useremail: { type: String, required: true },
  address: { type: String},
  phone: {type: String},
  status: {type: String, required: true},
  orderItems: [{
    product: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      category: { type: String, default: null },
      quantity: { type: Number, required: true },
      productSize: { type: String },
      quantities: { type: Map, of: Number },
      upgrades: { type: Map, of: Object },
      unitCost: { type: Number, required: true },
      totalCost: { type: Number, required: true },
      design: {
        front: { type: DesignSchema, default: null },
        back: { type: DesignSchema, default: null }
      },
      orderNote: { type: String, default: null },
    }
  }]
},
{
    timestamps: true 
});

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
