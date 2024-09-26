import { dbConnect } from "@/lib/mongo/connectDB";
import { ProductClient } from "./components/client";
import { ProductColumn } from './components/columns';

import { format } from 'date-fns';
import { IProduct, Product } from "@/Models/Product";
import { ICustomization} from '@/Models/Customization'
import { IUpgrade } from "@/Models/Upgrade";

const revalidate = 0

const ProductsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  await dbConnect();

  const products = await Product.find({
    storeId: params.storeId
  })
  .populate('category')
  .populate('industries')
  .populate('customizations')
  .populate('upgrades')
  .populate('deliveryCosts')
  .sort({ createdAt: -1 }).lean() as IProduct[];

  console.log(products)

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item._id,
    name: item.name,
    category: item.category.name,
    additionalCategories: item.additionalCategories,
    industries: item.industries,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    customizations: item.customizations,
    images: item.images,
    upgrades: item.upgrades,
    stock: item.stock,
    deliveryCosts: item.deliveryCosts,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
}

export default ProductsPage;
