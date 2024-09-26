import { Stores } from "@/Models/Store"
import { auth } from "@/auth"
import { dbConnect } from "@/lib/mongo/connectDB"
import { redirect } from "next/navigation"


export default async function SetupLayout({
        children
    }:{
        children: React.ReactNode
    }) {
        const session = await auth()
        const user = session?.user?.name

        if(!user){
            redirect('/login')
        }

        await dbConnect() 

        const store = await Stores.findOne({
        admin: user
     })

     if(store){
        redirect(`/${store._id}`)
     }
  return (
    <div>{children}</div>
  )
}
