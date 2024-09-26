"use server"

import {  signIn } from "@/auth"
// import { useRouter } from "next/navigation";

const Loginhandler = async(email: string, password: string) =>{
    "use server"

    
    try{
        const response: any = await signIn("credentials",{
            email,
            password,
            redirect: false
        })
        console.log({response})

    }catch(error: any) {
        console.error("login failed", error.cause)
       return "Invalid credentials"
    }
}

export default Loginhandler