"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { ICustomization } from "@/Models/Customization"
import { IUpgrade } from "@/Models/Upgrade"
import { IDeliveryCost } from "@/Models/Delivery"
import { category } from "@/Models/Category"
import { IIndustry } from "@/Models/Industry"


export type ProductColumn = {
  id: string
  name: string
  category: string
  additionalCategories?: string[]
  industries?: IIndustry[]
  isFeatured: boolean
  isArchived: boolean
  customizations: ICustomization[]
  images: string[]
  upgrades: IUpgrade[]
  stock: number
  deliveryCosts: IDeliveryCost
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "categoryLabel",
    header: "Category",
    cell: ({ row }) => row.original.category
  },
  {
    accessorKey: "industries",
    header: "Industries",
    cell: ({ row }) => (
      <ul className="">
      {row.original.industries?.map((industry) =>(
        <li className="" key={industry._id}>[{industry.name}]</li>
      ))}
    </ul>
    )
  },
  {
    accessorKey: "additionalCategories",
    header: "Additional Categories",
    cell: ({ row }) => (
      <ul className="">
      {row.original.additionalCategories?.map((ad) =>(
        <li className="" key={ad}>[{ad}]</li>
      ))}
    </ul>
    )
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => row.original.isFeatured ? 'Yes' : 'No'
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ row }) => row.original.isArchived ? 'Yes' : 'No'
  },
  {
    accessorKey: "customizations",
    header: "Customizations",
    cell: ({ row }) => (
      <ul className="flex gap-2 ">
        {row.original.customizations.map((customization) =>(
          <li className="" key={customization._id}>[{customization.type}]</li>
        ))}
      </ul>
    )
  },
  {
    accessorKey: "upgrades",
    header: "Upgrades",
    cell: ({ row }) => (
      <ul className="">
      {row.original.upgrades.map((upgrade) =>(
        <li className="" key={upgrade._id}>[{upgrade.name}]</li>
      ))}
    </ul>
    )
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => row.original.stock
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => row.original.createdAt
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
