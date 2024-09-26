import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongo/connectDB"
import { Stores } from "@/Models/Store"
import { Industry } from "@/Models/Industry"


export async function POST(
    req: Request,
    {params}: {params: {storeId: string}}
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name
    console.log('---------------------------------',user)

    const body= await req.json()

    const { name, billboardId , image} = body
     
    if(!user){
        return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!name){
        return new NextResponse("Name is Required", {status: 400})
    }

    if(!image){
        return new NextResponse("Image is Required", {status: 400})
    }

    if(!billboardId){
        return new NextResponse("Billboard is Required", {status: 400})
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

    const industry = await Industry.create({
        name: name,
        billboardId: billboardId,
        storeId: params.storeId,
        image: image
    })

    return NextResponse.json(industry)

   } catch(error){
    console.log('INDUSTRIES_POST]', error)
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

    const industries = await Industry.find({
        storeId: params.storeId
    }).populate('billboardId')

    return NextResponse.json(industries)

   } catch(error){
    console.log('INDUSTRIES_GET]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}