import { DeliveryCost, IDeliveryCost } from "@/Models/Delivery";
import { DeliveryCostClient } from "./components/client";
import { DeliveryColumn, columns } from './components/columns'
import { dbConnect } from "@/lib/mongo/connectDB";
import { format } from "date-fns";

const DeliveryCostsPage = async ({ params }: { params: { storeId: string } }) => {
  await dbConnect();

  const deliverycosts = await DeliveryCost.find({
    storeId: params.storeId
  }).sort({ createdAt: -1 }).lean() as IDeliveryCost[];

  const formattedDeliveryCosts: DeliveryColumn[] = deliverycosts.map((deliverycost) => ({
    id: deliverycost._id,
    category: deliverycost.category,
    pricesTiers: deliverycost.priceTiers.map((tier) => ({
      min: tier.min,
      max: tier.max,
      price: tier.price
    })),
    createdAt: format(deliverycost.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DeliveryCostClient data={formattedDeliveryCosts} />
      </div>
    </div>
  );
};

export default DeliveryCostsPage;
