import { IOrder, Order } from "@/Models/Order"
import { OrderClient } from "./components/client"
import { dbConnect } from "@/lib/mongo/connectDB"
import { OrderColumn} from './components/columns'

import {format} from 'date-fns'

const OrdersPage = async({
  params
}:{
  params : { storeId: string}
}) => {

 await dbConnect()

 const orders = await Order.find({ storeId: params.storeId })
 .select('storeId isPaid username useremail address phone status orderItems createdAt updatedAt')
 .sort({ createdAt: -1 }) ; 

  const formattedOrders : OrderColumn[] = orders.map((item : IOrder)=>({
    id: item._id,
    phone : item.phone,
    address : item.address,
    isPaid : item.isPaid,
    products : item.orderItems.map((orderItem)=> orderItem.product.name).join(','),
    price : item.orderItems.reduce((total, item) => {
      const price = item.product.totalCost;
      return total + Number(price);
    }, 0),
    status: item.status,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className="flex-col ">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <OrderClient data={formattedOrders}/>
        </div>
    </div>
  )
}

export default OrdersPage