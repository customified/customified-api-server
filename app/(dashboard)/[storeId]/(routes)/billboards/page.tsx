import { Billboard } from "@/Models/Billboard"
import { BillboardClient } from "./components/client"
import { dbConnect } from "@/lib/mongo/connectDB"
import {BillboardColumn} from './components/columns'

import {format} from 'date-fns'

const BillboardsPage = async({
  params
}:{
  params : { storeId: string}
}) => {

 await dbConnect()

  const billboards = await Billboard.find({
    storeId: params.storeId
  }).sort({ createdAt: -1 })

  const formattedBillboards : BillboardColumn[] = billboards.map((item)=>({
    id: item._id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className="flex-col ">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BillboardClient data={formattedBillboards}/>
        </div>
    </div>
  )
}

export default BillboardsPage