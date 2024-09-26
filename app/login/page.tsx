
import { auth } from "@/auth";
import LoginForm from "@/components/client/LoginForm";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { redirect } from "next/navigation";


const Page = async () => {

    const session = await auth();
    if (session?.user) {
      redirect("/");
      return null;
    }

    return (
        <div className="h-dvh items-center justify-center flex">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Sign In</CardTitle>

                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>

            </Card>
        </div>
    )
}

export default Page