import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongo/connectDB"
import { Stores } from "@/Models/Store"
import { Customization } from "@/Models/Customization"


export async function GET(
    req: Request,
    {params}: {params: {customizationId: string}}
) {
   try{
    
    if(!params.customizationId){
        return new NextResponse("Customization ID is Required", {status: 400})
    }

    await dbConnect() 

    const customization = await Customization.findOne({
        _id: params.customizationId
    })

    return NextResponse.json(customization)

   } catch(error){
    console.log('CUSTOMIZATION_GET]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}

export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string ,customizationId: string}}
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name

    const body= await req.json()

    const { name, type, options} = body
     
    if(!user){
        return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!name){
        return new NextResponse("Name is Required", {status: 400})
    }

    if(!type){
        return new NextResponse("Type is Required", {status: 400})
    }

    if(!params.customizationId){
        return new NextResponse("Customization ID is Required", {status: 400})
    }

    await dbConnect() 

    const storeByUserId = await Stores.findOne({
        admin: user,
        _id: params.storeId
    })

    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status: 403})
    }

    const customization = await Customization.updateMany({
        _id: params.customizationId
    },
    {
        $set: {
            name: name,
            type: type,
            options: options
        }
    }
)

    return NextResponse.json(customization)

   } catch(error){
    console.log('CUSTOMIZATIONS_PATCH]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}


export async function DELETE(
    req: Request,
    {params}: {params: {storeId: string ,customizationId: string}}
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name
     
    if(!user){
        return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!params.customizationId){
        return new NextResponse("Customization ID is Required", {status: 400})
    }

    await dbConnect() 
    
    const storeByUserId = await Stores.findOne({
        admin: user,
        _id: params.storeId
    })

    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status: 403})
    }

    const customization = await Customization.deleteMany({
        _id: params.customizationId
    })

    return NextResponse.json(customization)

   } catch(error){
    console.log('CUSTOMIZATION_DELETE]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}


