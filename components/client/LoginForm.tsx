"use client"

import Loginhandler from '@/actions/login'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

const LoginForm = () => {

    const router = useRouter()

    return (
        <form action={async (formData) => {

            "use client"
            const email = formData.get("email") as string
            const password = formData.get("password") as string

            if (!email || !password) { return toast.error("Please provide all feilds") }

            const toastId = toast.loading("logging In ")

            const error = await Loginhandler(email, password)

            if (!error) {
                toast.success("Login successful", {
                    id: toastId
                })
                router.refresh()

            } else {
                toast.error(error, {
                    id: toastId,
                })
            }
        }}
            className="flex flex-col gap-6" >
            <Input placeholder="Email" type='email' name="email" />
            <Input placeholder="Password" type='password' name="password" />
            <Button type='submit'>LOGIN</Button>
        </form>
    )
}

export default LoginForm