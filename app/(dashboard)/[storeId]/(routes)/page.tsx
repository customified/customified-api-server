import { Stores } from "@/Models/Store"
import { dbConnect } from "@/lib/mongo/connectDB"

interface DashboardPageProps{
  params : { storeId: string}
}

const DashboardPage : React.FC<DashboardPageProps> = async({
  params
}) => {
  await dbConnect()
  const store = await Stores.findOne({
    _id: params.storeId
  })

  return (
    <div>Active Store : {store?.name}</div>
  )
}

export default DashboardPage