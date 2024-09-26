import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export interface CustomizationOptionColumn  {
  id: string;
  name: string;
  value?: string;
  prices?: { min: string; max: string; price: string }[];
}

export interface CustomizationColumn {
  id: string;
  name: string;
  type: string;
  options?: CustomizationOptionColumn[];
  createdAt: string;
}

export const columns: ColumnDef<CustomizationColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'options',
    header: 'Options',
    cell: ({ row }) => (
      <ul className="flex flex-col text-md">
        {row.original.options?.map((option: CustomizationOptionColumn) => (
          <li key={option.id}>
            <span className="font-bold">{option.name}</span> 
          </li>
        ))}
      </ul>
    )
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
