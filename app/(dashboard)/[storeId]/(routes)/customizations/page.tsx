import { Customization, ICustomization } from "@/Models/Customization";
import { CustomizationClient } from "./components/client";
import { dbConnect } from "@/lib/mongo/connectDB";
import { CustomizationColumn, CustomizationOptionColumn } from "./components/columns";
import { format } from "date-fns";

const CustomizationsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
 await  dbConnect();

  const customizations = await Customization.find({
    storeId: params.storeId
  }).sort({ createdAt: -1 }).lean() as ICustomization[]


  const formattedCustomizations: CustomizationColumn[] = customizations.map((item) => ({
    id: item._id,
    name: item.name,
    type: item.type,
    options: item.options?.map((option) => ({
        id: option._id,
        name: option.name,
        value: option.value,
        prices: option.prices
    })),
    createdAt: format(item.createdAt, "MMMM do, yyyy")
}));
 
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CustomizationClient data={formattedCustomizations} />
      </div>
    </div>
  );
};

export default CustomizationsPage;
