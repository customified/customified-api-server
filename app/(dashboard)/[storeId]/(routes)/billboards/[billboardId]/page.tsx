import { Billboard } from "@/Models/Billboard"
import { dbConnect } from "@/lib/mongo/connectDB"
import { BillboardForm } from "./components/billboard-form"


const BillboardPage =async ({
        params
    }:{
        params: {billboardId: string}
    }) => {

    await dbConnect()
    const billboard = await Billboard.findOne({
        _id: params.billboardId
    })

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard}/>
        </div>
    </div>
  )
}

export default BillboardPage