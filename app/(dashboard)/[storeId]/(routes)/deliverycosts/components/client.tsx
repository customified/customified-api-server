"use client";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { DeliveryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface DeliveryClientProps {
  data: DeliveryColumn[];
}

export const DeliveryCostClient: React.FC<DeliveryClientProps> = ({ data }) => {
  
  const router = useRouter();
  const params = useParams();


  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Delivery Costs (${data.length})`}
          description="Manage delivery costs here"
        />
        <Button onClick={() => router.push(`/${params.storeId}/deliverycosts/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="category" />
      <Heading title="API" description="API calls for Delivery Costs" />
      <Separator />
      <ApiList 
        entityName="deliverycosts" 
        entityIdName="deliverycostId" 
      />
    </>
  );
};
