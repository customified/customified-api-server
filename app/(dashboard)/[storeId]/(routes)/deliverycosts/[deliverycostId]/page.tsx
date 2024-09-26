import { dbConnect } from "@/lib/mongo/connectDB"
import { DeliveryCostForm } from "./components/deliverycost-form"
import {DeliveryCost,IDeliveryCost } from "@/Models/Delivery"


const DeliveryCostsPage =async ({
        params
    }:{
        params: {deliverycostId: string}
    }) => {

   await dbConnect()
    const deliverycost = await DeliveryCost.findOne({
        _id: params.deliverycostId
    }).lean() as IDeliveryCost | null

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
        <DeliveryCostForm initialData={deliverycost}/>
        </div>
    </div>
  )
}

export default DeliveryCostsPage