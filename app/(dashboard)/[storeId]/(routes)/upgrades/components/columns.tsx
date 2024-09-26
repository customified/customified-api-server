import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";


export interface UpgradeColumn {
  id: string;
  name: string;
  mediaUrl: string;
  category: string;
  pricesTiers?: { min: string; max: string; price: string }[]
  createdAt: string;
}

export const columns: ColumnDef<UpgradeColumn>[] = [
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    id: "actions",
    cell: ({ row })=> <CellAction data={row.original}/>
  }
];
