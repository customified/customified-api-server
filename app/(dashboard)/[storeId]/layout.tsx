import { Stores } from "@/Models/Store";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongo/connectDB";
import Navbar from '@/components/Navbar'

import { redirect } from "next/navigation";


export default async function DashboardLayout({
    children,
    params
} : {
        children : React.ReactNode;
        params: {storeId: String}
    }) 
{
        const session = await auth()
        const user = session?.user?.name

        if(!user){
            redirect('/login')
        }

        await dbConnect() 

       const store = await Stores.findOne({
        _id: params.storeId,
        admin: user
    }) 


    if(!store){
        redirect('/')
    }

    return(
        <>
        <Navbar />
        {children}
        </>
    )
}
    

