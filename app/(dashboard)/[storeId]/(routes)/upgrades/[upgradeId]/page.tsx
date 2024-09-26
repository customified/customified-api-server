import { dbConnect } from "@/lib/mongo/connectDB"
import {UpgradeForm} from "./components/upgrade-form"
import { IUpgrade, Upgrade } from "@/Models/Upgrade"


const CustomizationPage =async ({
        params
    }:{
        params: {upgradeId: string}
    }) => {

    await dbConnect()
    const upgrade = await Upgrade.findOne({
        _id: params.upgradeId
    }).lean() as IUpgrade | null

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
        <UpgradeForm initialData={upgrade}/>
        </div>
    </div>
  )
}

export default CustomizationPage