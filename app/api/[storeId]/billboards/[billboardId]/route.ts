import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongo/connectDB"
import { Stores } from "@/Models/Store"
import { Billboard } from "@/Models/Billboard"


export async function GET(
    req: Request,
    {params}: {params: {billboardId: string}}
) {
   try{
    
    if(!params.billboardId){
        return new NextResponse("Billboard ID is Required", {status: 400})
    }

    await dbConnect() 

    const billboard = await Billboard.findOne({
        _id: params.billboardId
    })

    return NextResponse.json(billboard)

   } catch(error){
    console.log('BILLBOARD_DELETE]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}

export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string ,billboardId: string}}
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name

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

    if(!params.billboardId){
        return new NextResponse("Billboard ID is Required", {status: 400})
    }

    await dbConnect() 

    const storeByUserId = await Stores.findOne({
        admin: user,
        _id: params.storeId
    })

    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status: 403})
    }


    const billboard = await Billboard.updateMany({
        _id: params.billboardId
    },
    {
        $set: {
            label : label,
            imageUrl: imageUrl
        }
    }
)

    return NextResponse.json(billboard)

   } catch(error){
    console.log('BILLBOARDS_PATCH]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}


export async function DELETE(
    req: Request,
    {params}: {params: {storeId: string ,billboardId: string}}
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name
     
    if(!user){
        return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!params.billboardId){
        return new NextResponse("Billboard ID is Required", {status: 400})
    }

    await dbConnect() 

    const storeByUserId = await Stores.findOne({
        admin: user,
        _id: params.storeId
    })

    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status: 403})
    }

    const billboard = await Billboard.deleteMany({
        _id: params.billboardId
    })

    return NextResponse.json(billboard)

   } catch(error){
    console.log('BILLBOARD_DELETE]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}


