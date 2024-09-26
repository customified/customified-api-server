import { Category } from "@/Models/Category"
import { Stores } from "@/Models/Store"
import { auth } from "@/auth"
import { dbConnect } from "@/lib/mongo/connectDB"
import { NextResponse } from "next/server"
import { Billboard } from '@/Models/Billboard'; 

export async function GET(
    req: Request,
    {params}: {params: {categoryId: string}}
) {
   try{
    
    if(!params.categoryId){
        return new NextResponse("Category ID is Required", {status: 400})
    }

    await dbConnect() 

    const category = await Category.findOne({
        _id: params.categoryId
    }).populate('billboardId')

    return NextResponse.json(category)

   } catch(error){
    console.log('CATEGORY_GET]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}

export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string ,categoryId: string}}
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name

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
        return new NextResponse("Billboard ID is Required", {status: 400})
    }

    if(!params.categoryId){
        return new NextResponse("Category ID is Required", {status: 400})
    }

    await dbConnect() 

    const storeByUserId = await Stores.findOne({
        admin: user,
        _id: params.storeId
    })

    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status: 403})
    }

    const category = await Category.updateMany({
        _id: params.categoryId
    },
    {
        $set: {
            name : name,
            billboardId: billboardId,
            image: image
        }
    }
)

    return NextResponse.json(category)

   } catch(error){
    console.log('CATEGORY_PATCH]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}


export async function DELETE(
    req: Request,
    {params}: {params: {storeId: string ,categoryId: string}}
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name

     
    if(!user){
        return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!params.categoryId){
        return new NextResponse("Category ID is Required", {status: 400})
    }

    await dbConnect() 

    const storeByUserId = await Stores.findOne({
        admin: user,
        _id: params.storeId
    })

    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status: 403})
    }

    const category = await Category.deleteMany({
        _id: params.categoryId
    })

    return NextResponse.json(category)

   } catch(error){
    console.log('CATEGORY_DELETE]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}


