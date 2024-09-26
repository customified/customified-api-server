import { dbConnect } from "@/lib/mongo/connectDB"
import { ProductForm } from "./components/product-form"
import { IProduct, Product } from "@/Models/Product"
import { Category, category } from "@/Models/Category"
import { Customization, ICustomization } from "@/Models/Customization"
import { IUpgrade, Upgrade } from "@/Models/Upgrade"
import { DeliveryCost, IDeliveryCost } from "@/Models/Delivery"
import { IIndustry, Industry } from "@/Models/Industry"

const ProductPage = async ({
    params
}: {
    params: { productId: string, storeId: string }
}) => {

    await dbConnect()

    const product = await Product.findOne({
        _id: params.productId
    }).populate('category').populate('industries').populate('customizations').populate('upgrades').populate('deliveryCosts').lean() as IProduct

    const categories = await Category.find({
        storeId: params.storeId
    }).sort({ createdAt: -1 }).lean() as category[]

    const industries = await Industry.find({
        storeId: params.storeId
    }).sort({ createdAt: -1 }).lean() as IIndustry[]

    const customizations = await Customization.find({
        storeId: params.storeId
    }).sort({ createdAt: -1 }).lean() as ICustomization[]

    const upgrades = await Upgrade.find({
        storeId: params.storeId
    }).sort({ createdAt: -1 }).lean() as IUpgrade[]

    const deliveryCosts = await DeliveryCost.find({
        storeId: params.storeId
    }).sort({ createdAt: -1 }).lean() as IDeliveryCost[]

   

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm 
                    categories={categories}
                    industries={industries} 
                    customizations={customizations}
                    upgrades={upgrades}
                    deliveryCosts={deliveryCosts}
                    initialData={product}

                />
            </div>
        </div>
    )
}

export default ProductPage
