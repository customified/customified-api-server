import { CategoryClient } from "./components/client"
import { dbConnect } from "@/lib/mongo/connectDB"
import {CategoryColumn} from './components/columns'

import {format} from 'date-fns'
import { Category } from "@/Models/Category"

const CategoriesPage = async({
  params
}:{
  params : { storeId: string}
}) => {

  await dbConnect()

  const categories = await Category.find({
    storeId: params.storeId
  }).populate('billboardId').sort({ createdAt: -1 })


  const formattedCategories : CategoryColumn[] = categories.map((item)=>({
    id: item._id,
    name: item.name,
    billboardLabel: item.billboardId.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className="flex-col ">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryClient data={formattedCategories}/>
        </div>
    </div>
  )
}

export default CategoriesPage