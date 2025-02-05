"use client"

import { Heading } from "@/components/ui/Heading"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"
import { OrderColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import ApiList from "@/components/ui/api-list"
import { IOrder } from "@/Models/Order"

interface OrderClientProps{
  data: OrderColumn[]
}

export const OrderClient : React.FC<OrderClientProps>= ({
  data,
}) => {

    const router = useRouter()
    const params = useParams()
 
  return (
    <>
        <div className="flex items-center justify-between">
            <Heading 
            title={`Order (${data.length})`}
            description= "handle Orders here"
            /> 
        </div>
        <Separator/>
        <DataTable columns={columns} data={data} searchKey="products"/>
        <Heading title="API" description="API calls for orders"/>
        <Separator />
        <ApiList 
        entityName="Order"
        entityIdName="orderId"/>
    </>
  )
}

