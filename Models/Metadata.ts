import mongoose, { Schema, Document, model } from 'mongoose';

export interface ISessionMetadata extends Document {
  storeId: string;
  userName: string;
  userEmail: string;
  cartItems: string; 
}

const SessionMetadataSchema: Schema = new Schema({
  storeId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  cartItems: { type: String, required: true },
});

const SessionMetadata = mongoose.models.SessionMetadata || model<ISessionMetadata>('SessionMetadata', SessionMetadataSchema);

export { SessionMetadata };
