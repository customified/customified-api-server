import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongo/connectDB"
import { Stores } from "@/Models/Store"
import { DeliveryCost } from "@/Models/Delivery"

import { v4 as uuidv4 } from 'uuid';


export async function POST(
    req: Request,
    {params}: {params: {storeId: string}}
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name
    console.log('---------------------------------',user)

    const body= await req.json()

    const { category, priceTiers } = body
     
    if(!user){
        return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!category){
        return new NextResponse("Name is Required", {status: 400})
    }

    if(!priceTiers){
        return new NextResponse("PriceTier is Required", {status: 400})
    }

    if(!params.storeId){
        return new NextResponse("Store ID is Required", {status: 400})
    }

    await dbConnect() 

    const storeByUserId = await Stores.findOne({
        admin: user,
        _id: params.storeId
    })

    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status: 403})
    }

    const deliverycost = await DeliveryCost.create({
        _id:uuidv4(),
        category: category,
        priceTiers: priceTiers,
        storeId: params.storeId
    })

    return NextResponse.json(deliverycost)

   } catch(error){
    console.log('DELIVERYCOST_POST]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}


export async function GET(
    req: Request,
    {params}: {params: {storeId: string}}
) {
   try{

    if(!params.storeId){
        return new NextResponse("Store ID is Required", {status: 400})
    }

    await dbConnect() 

    const deliverycost = await DeliveryCost.find({
        storeId: params.storeId
    })

    return NextResponse.json(deliverycost)

   } catch(error){
    console.log('DELIVERYCOST_GET]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}