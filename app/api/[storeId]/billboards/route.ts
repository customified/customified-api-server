import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongo/connectDB"
import { Stores } from "@/Models/Store"
import { Billboard } from "@/Models/Billboard"

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

    const { label, imageUrl } = body
     
    if(!user){
        return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!label){
        return new NextResponse("Label is Required", {status: 400})
    }

    if(!imageUrl){
        return new NextResponse("Image URL is Required", {status: 400})
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

    const billboard = await Billboard.create({
        _id:uuidv4(),
        label:label,
        imageUrl: imageUrl,
        storeId: params.storeId
    })

    return NextResponse.json(billboard)

   } catch(error){
    console.log('BILLBOARDS_POST]', error)
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

    const billboards = await Billboard.find({
        storeId: params.storeId
    })

    return NextResponse.json(billboards)

   } catch(error){
    console.log('BILLBOARDS_GET]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}