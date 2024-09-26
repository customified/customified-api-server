import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongo/connectDB"
import { Stores } from "@/Models/Store"
import { Upgrade } from "@/Models/Upgrade"

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

    const { name, category, mediaUrl, priceTiers } = body
     
    if(!user){
        return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!name){
        return new NextResponse("Name is Required", {status: 400})
    }

    if(!mediaUrl){
        return new NextResponse("Media URL is Required", {status: 400})
    }

    if(!category){
        return new NextResponse("Category is Required", {status: 400})
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

    const upgrade = await Upgrade.create({
        _id:uuidv4(),
        name: name,
        category: category,
        mediaUrl: mediaUrl,
        priceTiers: priceTiers,
        storeId: params.storeId
    })

    return NextResponse.json(upgrade)

   } catch(error){
    console.log('UPGRADES_POST]', error)
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

    const upgrades = await Upgrade.find({
        storeId: params.storeId
    })

    return NextResponse.json(upgrades)

   } catch(error){
    console.log('UPGRADES_GET]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}