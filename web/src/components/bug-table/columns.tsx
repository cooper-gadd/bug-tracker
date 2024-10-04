import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    header: "ID",
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
    cell: ({ row }) => row.original.dateRaised.toLocaleDateString(),
  },
  {
    header: "Target Date",
    accessorKey: "targetDate",
    cell: ({ row }) => row.original.targetDate?.toLocaleDateString() || "N/A",
  },
  {
    header: "Date Closed",
    accessorKey: "dateClosed",
    cell: ({ row }) => row.original.dateClosed?.toLocaleDateString() || "N/A",
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
