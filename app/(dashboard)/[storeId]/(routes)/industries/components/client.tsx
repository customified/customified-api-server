"use client"

import { Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { IndustryColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import ApiList from "@/components/ui/api-list"

interface IndustryClientProps{
  data: IndustryColumn[]
}

export const IndustryClient : React.FC<IndustryClientProps>= ({
  data
}) => {

    const router = useRouter()
    const params = useParams()

  return (
    <>
        <div className="flex items-center justify-between">
            <Heading 
            title={`Industries (${data.length})`}
            description= "Manage Industries here"
            />
            <Button onClick={()=> router.push(`/${params.storeId}/industries/new`)}>
                <Plus className="mr-2 h-4 w-4"/>
                Add New
            </Button>
           
        </div>
        <Separator/>
        <DataTable columns={columns} data={data} searchKey="name"/>
        <Heading title="API" description="API calls for Industries "/>
        <Separator />
        <ApiList 
        entityName="industries"
        entityIdName="industryId"/>
    </>
  )
}

