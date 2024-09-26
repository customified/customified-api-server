import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";


export interface DeliveryColumn {
  id: string;
  category: string;
  pricesTiers?: { min: string; max: string; price: string }[]
  createdAt: string;
}

export const columns: ColumnDef<DeliveryColumn>[] = [
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
