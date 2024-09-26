import { Industry } from "@/Models/Industry"
import { Stores } from "@/Models/Store"
import { auth } from "@/auth"
import { dbConnect } from "@/lib/mongo/connectDB"
import { NextResponse } from "next/server"
import { Billboard } from '@/Models/Billboard';


export async function GET(
    req: Request,
    {params}: {params: {industryId: string}}
) {
   try{
    
    if(!params.industryId){
        return new NextResponse("Industry ID is Required", {status: 400})
    }

    await dbConnect() 

    const industry = await Industry.findOne({
        _id: params.industryId
    }).populate('billboardId')

    return NextResponse.json(industry)

   } catch(error){
    console.log('INDUSTRY_GET]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}

export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string ,industryId: string}}
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name

    const body= await req.json()

    const { name, billboardId, image } = body
     
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
        return new NextResponse("Billboard ID is Required", {status: 400})
    }

    if(!params.industryId){
        return new NextResponse("Industry ID is Required", {status: 400})
    }

    await dbConnect() 

    const storeByUserId = await Stores.findOne({
        admin: user,
        _id: params.storeId
    })

    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status: 403})
    }

    const industry = await Industry.updateMany({
        _id: params.industryId
    },
    {
        $set: {
            name : name,
            billboardId: billboardId,
            image: image
        }
    }
)

    return NextResponse.json(industry)

   } catch(error){
    console.log('INDUSTRY_PATCH]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}


export async function DELETE(
    req: Request,
    {params}: {params: {storeId: string ,industryId: string}}
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name

     
    if(!user){
        return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!params.industryId){
        return new NextResponse("Industry ID is Required", {status: 400})
    }

    await dbConnect() 

    const storeByUserId = await Stores.findOne({
        admin: user,
        _id: params.storeId
    })

    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status: 403})
    }

    const industry = await Industry.deleteMany({
        _id: params.industryId
    })

    return NextResponse.json(industry)

   } catch(error){
    console.log('INDUSTRY_DELETE]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}


