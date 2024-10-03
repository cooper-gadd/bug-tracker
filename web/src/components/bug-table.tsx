import { ColumnDef } from "@tanstack/react-table";

export type Bug = {
  id: number;
  description: string;
  summary: string;
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
  };
  status: "Backlog" | "Todo" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  raised: Date;
  target: Date | null;
  closed: Date | null;
  fixedDescription: string | null;
};

export const columns: ColumnDef<Bug>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Description",
    accessorKey: "description",
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
    header: "Owner",
    accessorKey: "owner.name",
  },
  {
    header: "Assigned To",
    accessorKey: "assignedTo.name",
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
    header: "Raised",
    accessorKey: "raised",
  },
  {
    header: "Target",
    accessorKey: "target",
  },
  {
    header: "Closed",
    accessorKey: "closed",
  },
  {
    header: "Fixed Description",
    accessorKey: "fixedDescription",
  },
];

export function BugTable() {}
