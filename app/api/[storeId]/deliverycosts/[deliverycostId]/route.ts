import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongo/connectDB"
import { Stores } from "@/Models/Store"
import { DeliveryCost } from "@/Models/Delivery"


export async function GET(
    req: Request,
    { params }: { params: { deliverycostId: string } }
) {
    try {

        if (!params.deliverycostId) {
            return new NextResponse("Delivery cost ID is Required", { status: 400 })
        }

        await dbConnect()

        const deliverycost = await DeliveryCost.findOne({
            _id: params.deliverycostId
        })

        return NextResponse.json(deliverycost)

    } catch (error) {
        console.log('DELIVERYCOST_DELETE]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, deliverycostId: string } }
) {
    try {
        const session = await auth()

        const user = session?.user?.name

        const body = await req.json()

        const { category,priceTiers } = body

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }


        if (!category) {
            return new NextResponse("Category is Required", { status: 400 })
        }

        if (!priceTiers) {
            return new NextResponse("PriceTier is Required", { status: 400 })
        }

        if (!params.deliverycostId) {
            return new NextResponse("Delivery Cost ID is Required", { status: 400 })
        }

        await dbConnect() 

        const storeByUserId = await Stores.findOne({
            admin: user,
            _id: params.storeId
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        const deliverycost = await DeliveryCost.updateMany({
            _id: params.deliverycostId
        },
            {
                $set: {
                    category: category,
                    priceTiers: priceTiers
                }
            }
        )

        return NextResponse.json(deliverycost)

    } catch (error) {
        console.log('DELIVERYCOSTS_PATCH]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}


export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, deliverycostId: string } }
) {
    try {
        const session = await auth()

        const user = session?.user?.name

        if (!user) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!params.deliverycostId) {
            return new NextResponse("deliverycost ID is Required", { status: 400 })
        }

        await dbConnect() 

        const storeByUserId = await Stores.findOne({
            admin: user,
            _id: params.storeId
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        const deliverycost = await DeliveryCost.deleteMany({
            _id: params.deliverycostId
        })

        return NextResponse.json(deliverycost)

    } catch (error) {
        console.log('DELIVERYCOST_DELETE]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}


