import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongo/connectDB"
import { Stores } from "@/Models/Store"
import { Category } from "@/Models/Category"
import { Billboard } from '@/Models/Billboard'; 

export async function POST(
    req: Request,
    {params}: {params: {storeId: string}}
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name
    console.log('---------------------------------',user)

    const body= await req.json()

    const { name, billboardId , image, product_description, faq } = body
     
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

    // Validate arrays if provided
    if (product_description !== undefined) {
        if (!Array.isArray(product_description)) {
            return new NextResponse("product_description must be an array", { status: 400 })
        }
        for (const item of product_description) {
            if (!item || typeof item !== 'object') {
                return new NextResponse("each product_description item must be an object", { status: 400 })
            }
            if (typeof item.key !== 'string' || typeof item.value !== 'string') {
                return new NextResponse("each product_description item must have key and value strings", { status: 400 })
            }
        }
    }

    if (faq !== undefined) {
        if (!Array.isArray(faq)) {
            return new NextResponse("faq must be an array", { status: 400 })
        }
        for (const item of faq) {
            if (!item || typeof item !== 'object') {
                return new NextResponse("each faq item must be an object", { status: 400 })
            }
            if (typeof item.key !== 'string' || typeof item.value !== 'string') {
                return new NextResponse("each faq item must have key and value strings", { status: 400 })
            }
        }
    }

    const category = await Category.create({
        name: name,
        billboardId: billboardId,
        storeId: params.storeId,
        image: image,
        ...(product_description !== undefined ? { product_description } : {}),
        ...(faq !== undefined ? { faq } : {})
    })

    return NextResponse.json(category)

   } catch(error){
    console.log('CATEGORIES_POST]', error)
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

    const categories = await Category.find({
        storeId: params.storeId
    }).sort({'weight': -1}).populate('billboardId')

    return NextResponse.json(categories)

   } catch(error){
    console.log('CATEGORIES_GET]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}