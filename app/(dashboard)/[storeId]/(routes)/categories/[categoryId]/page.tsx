import { dbConnect } from "@/lib/mongo/connectDB"
import { CategoryForm } from "./components/category-form"
import { Category } from "@/Models/Category"
import { Billboard } from "@/Models/Billboard"


const CategoryPage =async ({
        params
    }:{
        params: {categoryId: string, storeId: string}
    }) => {

    await dbConnect()
    const categoryDoc = await Category.findOne({
        _id: params.categoryId
    })

    const billboardDocs = await Billboard.find({
      storeId: params.storeId
    })

    // ✅ Convert to plain objects
    const category = categoryDoc ? categoryDoc.toObject() : null;
    const billboards = billboardDocs.map(doc => doc.toObject());

  return (<div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category}/>
        </div>
    </div>
  )
}

export default CategoryPage