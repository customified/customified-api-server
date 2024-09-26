import { IndustryClient } from "./components/client"
import { dbConnect } from "@/lib/mongo/connectDB"
import { IndustryColumn } from './components/columns'

import {format} from 'date-fns'
import { Industry } from "@/Models/Industry"

const CategoriesPage = async({
  params
}:{
  params : { storeId: string}
}) => {

  await dbConnect()

  const industries = await Industry.find({
    storeId: params.storeId
  }).populate('billboardId').sort({ createdAt: -1 })


  const formattedIndustries : IndustryColumn[] = industries.map((item)=>({
    id: item._id,
    name: item.name,
    billboardLabel: item.billboardId.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className="flex-col ">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <IndustryClient data={formattedIndustries}/>
        </div>
    </div>
  )
}

export default CategoriesPage