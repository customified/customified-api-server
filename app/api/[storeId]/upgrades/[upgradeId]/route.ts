import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongo/connectDB"
import { Stores } from "@/Models/Store"
import { Upgrade } from "@/Models/Upgrade"


export async function GET(
    req: Request,
    {params}: {params: {upgradeId: string}}
) {
   try{
    
    if(!params.upgradeId){
        return new NextResponse("Upgrade ID is Required", {status: 400})
    }

    await dbConnect() 

    const upgrade = await Upgrade.findOne({
        _id: params.upgradeId
    })

    return NextResponse.json(upgrade)

   } catch(error){
    console.log('UPGRADE_DELETE]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}

export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string ,upgradeId: string}}
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name

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

    if(!params.upgradeId){
        return new NextResponse("Upgrade ID is Required", {status: 400})
    }

    await dbConnect() 

    const storeByUserId = await Stores.findOne({
        admin: user,
        _id: params.storeId
    })

    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status: 403})
    }

    const upgrade = await Upgrade.updateMany({
        _id: params.upgradeId
    },
    {
        $set: {
            name: name,
            category: category,
            mediaUrl: mediaUrl,
            priceTiers: priceTiers
        }
    }
)

    return NextResponse.json(upgrade)

   } catch(error){
    console.log('UPGRADES_PATCH]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}


export async function DELETE(
    req: Request,
    {params}: {params: {storeId: string ,upgradeId: string}}
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name
     
    if(!user){
        return new NextResponse("Unauthenticated", {status: 401})
    }

    if(!params.upgradeId){
        return new NextResponse("Upgrade ID is Required", {status: 400})
    }

    await dbConnect() 

    const storeByUserId = await Stores.findOne({
        admin: user,
        _id: params.storeId
    })

    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status: 403})
    }

    const upgrade = await Upgrade.deleteMany({
        _id: params.upgradeId
    })

    return NextResponse.json(upgrade)

   } catch(error){
    console.log('UPGRADE_DELETE]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}


