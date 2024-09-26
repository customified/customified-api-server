import { Upgrade, IUpgrade } from "@/Models/Upgrade";
import { UpgradeClient } from "./components/client";
import {UpgradeColumn, columns} from  './components/columns'
import { dbConnect } from "@/lib/mongo/connectDB";
import { format } from "date-fns";

const UpgradesPage = async ({ params }: { params: { storeId: string } }) => {
  await dbConnect();

  const upgrades = await Upgrade.find({
    storeId: params.storeId
  }).sort({ createdAt: -1 }).lean() as IUpgrade[];

  const formattedUpgrades: UpgradeColumn[] = upgrades.map((upgrade) => ({
    id: upgrade._id,
    name: upgrade.name,
    mediaUrl: upgrade.mediaUrl,
    category: upgrade.category,
    pricesTiers: upgrade.priceTiers.map((tier) => ({
      min: tier.min,
      max: tier.max,
      price: tier.price
    })),
    createdAt: format(upgrade.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UpgradeClient data={formattedUpgrades} />
      </div>
    </div>
  );
};

export default UpgradesPage;
