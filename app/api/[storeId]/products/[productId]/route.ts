import { Product } from "@/Models/Product"
import { Stores } from "@/Models/Store"
import { auth } from "@/auth"
import { dbConnect } from "@/lib/mongo/connectDB"
import { NextResponse } from "next/server"


export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {

        if (!params.productId) {
            return new NextResponse("Product ID is Required", { status: 400 })
        }

        await dbConnect()

        const product = await Product.findOne({
            slug: params.productId
        }).populate('category').populate('customizations').populate('industries').populate('additionalCategories').populate('upgrades').populate('deliveryCosts')

        return NextResponse.json(product,{
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
          })

    } catch (error) {
        console.log('PRODUCT_GET]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const session = await auth()

        const user = session?.user?.name

        const body = await req.json()

        const { name, categoryId, description ,industries, additionalCategories, isFeatured, isArchived, customizations, images, upgrades, stock, deliveryCostId } = body

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Name is Required", { status: 400 })
        }

        if (!categoryId) {
            return new NextResponse("category id is Required", { status: 400 })
        }


        if (!customizations) {
            return new NextResponse("customizations is Required", { status: 400 })
        }

        if (!images) {
            return new NextResponse("images is Required", { status: 400 })
        }

        if (!upgrades) {
            return new NextResponse("upgrades is Required", { status: 400 })
        }

        if (!stock) {
            return new NextResponse("stock is Required", { status: 400 })
        }

        if (!deliveryCostId) {
            return new NextResponse("deliverycost  is Required", { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is Required", { status: 400 })
        }

        await dbConnect() 

        const storeByUserId = await Stores.findOne({
            admin: user,
            _id: params.storeId
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        const product = await Product.updateMany({
            _id: params.productId
        },
            {
                $set: {
                    name: name,
                    category: categoryId,
                    description: description,
                    industries: industries,
                    additionalCategories: additionalCategories,
                    isFeatured: isFeatured,
                    isArchived: isArchived,
                    customizations: customizations,
                    upgrades: upgrades,
                    images: images,
                    stock: stock,
                    deliveryCosts: deliveryCostId
                }
            }
        )

        return NextResponse.json(product)

    } catch (error) {
        console.log('PRODCUT_PATCH]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}


export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const session = await auth()

        const user = session?.user?.name


        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!params.productId) {
            return new NextResponse("Product ID is Required", { status: 400 })
        }

        await dbConnect() 

        const storeByUserId = await Stores.findOne({
            admin: user,
            _id: params.storeId
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        const product = await Product.deleteMany({
            _id: params.productId
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('PRODUCT_DELETE]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}


