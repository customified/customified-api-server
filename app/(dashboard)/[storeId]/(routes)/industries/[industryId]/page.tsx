import { dbConnect } from "@/lib/mongo/connectDB"
import { IndustryForm } from "./components/industry-form"
import { Industry } from "@/Models/Industry"
import { Billboard } from "@/Models/Billboard"


const IndustryPage =async ({
        params
    }:{
        params: {industryId: string, storeId: string}
    }) => {

   await dbConnect()
    const industry = await Industry.findOne({
        _id: params.industryId
    })

    const billboards = await Billboard.find({
      storeId: params.storeId
    })

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
        <IndustryForm billboards={billboards} initialData={industry}/>
        </div>
    </div>
  )
}

export default IndustryPage