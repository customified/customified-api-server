import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongo/connectDB"
import { Stores } from "@/Models/Store"

export async function POST(
    req: Request,
) {
   try{
    const session = await auth()
  
    const user = session?.user?.name
    const body= await req.json()

    const {name} = body
     
    if(!user){
        return new NextResponse("Unauthorized", {status: 401})
    }

    if(!name){
        return new NextResponse("Name is Requires", {status: 400})
    }

    await dbConnect() 

    const store = await Stores.create({
        name: name,
        admin: user
    })

    return NextResponse.json(store)

   } catch(error){
    console.log('[STORES_POST]', error)
    return new NextResponse("Internal Error", {status: 500})
   }
}