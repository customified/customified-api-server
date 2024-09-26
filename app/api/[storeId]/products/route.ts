import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongo/connectDB"
import { Stores } from "@/Models/Store"
import { IProduct, Product } from "@/Models/Product"


export async function POST(
    req: Request,
    {params}: {params: {storeId: string}}
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name

    if(!user){
        return new NextResponse("Unauthenticated", {status: 401})
    }

    const body= await req.json()

    const {
        name,
        categoryId,
        description,
        industries,
        additionalCategories,
        isFeatured,
        isArchived,
        customizations,
        images,
        upgrades,
        stock,
        deliveryCostId
    } = body;
    

    if(!name){
        return new NextResponse("Name is Required", {status: 400})
    }

    if(!categoryId){
        return new NextResponse("category id is Required", {status: 400})
    }


    if(!customizations){
        return new NextResponse("customizations is Required", {status: 400})
    }

    if(!images){
        return new NextResponse("images is Required", {status: 400})
    }

    if(!upgrades){
        return new NextResponse("upgrades is Required", {status: 400})
    }

    if(!stock){
        return new NextResponse("stock is Required", {status: 400})
    }

    if(!deliveryCostId){
        return new NextResponse("deliverycost  is Required", {status: 400})
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

    const product = await Product.create({
        name,
        category: categoryId,
        description: description,
        industries: industries,
        additionalCategories: additionalCategories,
        isFeatured,
        isArchived,
        customizations,
        upgrades,
        images,
        stock,
        deliveryCosts: deliveryCostId,
        storeId: params.storeId
    })

    const createdProduct = await Product.findById(product._id).lean();

    return NextResponse.json(createdProduct);

   } catch(error){
    console.log('[PRODUCTS_POST]', error)
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

    const products = await Product.find({
        storeId: params.storeId
    }).populate('category')
    .populate('industries').populate('additionalCategories')
    .populate('customizations')
    .populate('upgrades')
    .populate('deliveryCosts').lean() as IProduct[]
    return NextResponse.json(products)

   } catch(error){
    console.log('PRODUCTS_GET]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}