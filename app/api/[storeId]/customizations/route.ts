import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongo/connectDB"
import { Stores } from "@/Models/Store"
import { Customization} from "@/Models/Customization"

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

    const { name , type , options } = body
     
    if(!user){
        return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!name){
        return new NextResponse("Name is Required", {status: 400})
    }

    if(!type){
        return new NextResponse("Type is Required", {status: 400})
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

    const customization= await Customization.create({
        _id:uuidv4(),
        name: name,
        type: type,
        options: options,
        storeId: params.storeId
    })

    return NextResponse.json(customization)

   } catch(error){
    console.log('CUSTOMIZATIONS_POST]', error)
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

    const customizations = await Customization.find({
        storeId: params.storeId
    })

    return NextResponse.json(customizations)

   } catch(error){
    console.log('BILLBOARDS_GET]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}