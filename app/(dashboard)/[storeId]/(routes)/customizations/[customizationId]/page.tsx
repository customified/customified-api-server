import { Customization, ICustomization } from "@/Models/Customization"
import { dbConnect } from "@/lib/mongo/connectDB"
import { CustomizationForm } from "./components/customization-form"


const CustomizationPage =async ({
        params
    }:{
        params: {customizationId: string}
    }) => {

   await dbConnect()
    const customization = await Customization.findOne({
        _id: params.customizationId
    }).lean() as ICustomization | null

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
        <CustomizationForm initialData={customization}/>
        </div>
    </div>
  )
}

export default CustomizationPage