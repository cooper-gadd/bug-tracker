import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export type Bug = {
  id: number;
  project: {
    id: number;
    name: string;
  };
  owner: {
    id: number;
    name: string;
  };
  assignedTo: {
    id: number;
    name: string;
  } | null;
  status: "Unassigned" | "Assigned" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  summary: string;
  description: string;
  fixedDescription: string | null;
  dateRaised: Date;
  targetDate: Date | null;
  dateClosed: Date | null;
};

export const columns: ColumnDef<Bug>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "id",
  },
  {
    header: "Summary",
    accessorKey: "summary",
  },
  {
    header: "Project",
    accessorKey: "project.name",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Priority",
    accessorKey: "priority",
  },
  {
    header: "Owner",
    accessorKey: "owner.name",
  },
  {
    header: "Assigned To",
    accessorKey: "assignedTo.name",
    cell: ({ row }) => row.original.assignedTo?.name || "Unassigned",
  },
  {
    header: "Date Raised",
    accessorKey: "dateRaised",
    cell: ({ row }) =>
      row.original.dateRaised.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
  },
  {
    header: "Target Date",
    accessorKey: "targetDate",
    cell: ({ row }) =>
      row.original.targetDate?.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }) || "N/A",
  },
  {
    header: "Date Closed",
    accessorKey: "dateClosed",
    cell: ({ row }) =>
      row.original.targetDate?.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }) || "N/A",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const bug = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Bug</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Change Priority</DropdownMenuItem>
            <DropdownMenuItem>Change Status</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Assign Bug</DropdownMenuItem>
            {bug.status !== "Closed" && (
              <DropdownMenuItem>Mark as Closed</DropdownMenuItem>
            )}
            {bug.status === "Closed" && (
              <DropdownMenuItem>Reopen Bug</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];