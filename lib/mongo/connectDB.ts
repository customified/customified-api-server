// lib/mongoose.ts
import mongoose from 'mongoose';

export const dbConnect = async() =>{
  try{
    if(mongoose.connections && mongoose.connections[0].readyState) return;

    const {connection} = await mongoose.connect(
      process.env.MONGODB_URI as string,
      {
        dbName: "imprintion"
      }
    )

    console.log(`Connected to database ${connection.host}`)
  }catch(e){
    throw new Error(e as string) 
  }
}