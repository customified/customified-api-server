 // Start of Selection
import { IOrder, Order } from "@/Models/Order";
import { OrderClient } from "./components/client";
import { dbConnect } from "@/lib/mongo/connectDB";
import { OrderColumn } from "./components/columns";

import { format } from "date-fns";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OrderDetailsModal } from "./components/OrderModal";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  await dbConnect();

  const orders = await Order.find({ storeId: params.storeId })
    .select(
      "storeId isPaid username useremail address phone status orderItems createdAt updatedAt"
    )
    .lean()
    .sort({ createdAt: -1 });

  return (
    <div className="flex-col p-4">
      <>
        <div className="flex items-center justify-between">
          <Heading
            title={`Order (${orders.length})`}
            description="handle Orders here"
          />
        </div>

        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  isPaid
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order: any) => (
                <tr key={order._id}>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                    {order.orderItems.map((item: any) => item.product.name).join(", ")}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                    {order.phone}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                    {order.address}
                  </td>
                  {order.isPaid ? (
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-green-500 ">
                      Paid
                    </td>
                  ) : (
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-red-500 ">
                      Pending
                    </td>
                  )}
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                    {order.status}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                    $
                    {order.orderItems.reduce((total: any, item: any) => {
                      const price = item.product.totalCost;
                      return total + Number(price);
                    }, 0).toFixed(2)}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(order.createdAt), "PPP p")}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                    <OrderDetailsModal order={order} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Separator />
        <Heading title="API" description="API calls for orders" />
        <Separator />
        <ApiList entityName="Order" entityIdName="orderId" />
      </>
    </div>
  );
};

export default OrdersPage;
