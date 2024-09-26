import NextAuth, { CredentialsSignin } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {Stores} from '@/Models/Store'
import { dbConnect } from "./lib/mongo/connectDB";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials:{
        email:{ label: "Email", type: "email" },
        password:{ label: "Password", type: "password" }
      },
      authorize: async(credentials) =>{
        
        const email= credentials.email ;
        const password= credentials.password ;

        const hardcodedUser = {
          email: process.env.EMAIL,
          password: process.env.PASSWORD ,
          name: process.env.NAME
        };

        
        if (email === hardcodedUser.email && password === hardcodedUser.password) {
          return { name: hardcodedUser.name, email: hardcodedUser.email };
        }

        return null
      }
    })
  ],
  pages:{
    signIn: "/login"
  }
})