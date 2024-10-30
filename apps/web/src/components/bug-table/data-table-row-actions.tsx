import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { bugTableSchema } from "@/data/schema";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import React from "react";
import { AssignForm } from "./assign-form";
import { CloseForm } from "./close-form";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const bug = bugTableSchema.parse(row.original);
  const [action, setAction] = React.useState<
    "info" | "edit" | "assign" | "close"
  >("info");

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted  ml-auto"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setAction("info")}>
              Info
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setAction("edit")}>
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setAction("assign")}>
              Assign
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setAction("close")}>
              Close
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bug.summary}</DialogTitle>
          <DialogDescription>{bug.description}</DialogDescription>
        </DialogHeader>
        {action === "info" && <Info bug={bug} />}
        {action === "edit" && <Edit />}
        {action === "assign" && <AssignForm bug={bug} />}
        {action === "close" && <CloseForm bug={bug} />}
      </DialogContent>
    </Dialog>
  );
}

function Info({ bug }: { bug: ReturnType<typeof bugTableSchema.parse> }) {
  return (
    <>
      <p>
        <strong>ID:</strong> {bug.id}
      </p>
      <p>
        <strong>Project:</strong> {bug.project}
      </p>
      <p>
        <strong>Owner:</strong> {bug.owner}
      </p>
      {bug.assignedTo && (
        <p>
          <strong>Assigned to:</strong> {bug.assignedTo}
        </p>
      )}
      <p>
        <strong>Status:</strong> {bug.status}
      </p>
      <p>
        <strong>Priority:</strong> {bug.priority}
      </p>
      <p>
        <strong>Summary:</strong> {bug.summary}
      </p>
      <p>
        <strong>Description:</strong> {bug.description}
      </p>
      {bug.fixDescription && (
        <p>
          <strong>Fix Description:</strong> {bug.fixDescription}
        </p>
      )}
      <p>
        <strong>Date Raised:</strong> {bug.dateRaised.toLocaleDateString()}
      </p>
      {bug.targetDate && (
        <p>
          <strong>Target Date:</strong> {bug.targetDate.toLocaleDateString()}
        </p>
      )}
      {bug.dateClosed && (
        <p>
          <strong>Date Closed:</strong> {bug.dateClosed.toLocaleDateString()}
        </p>
      )}
    </>
  );
}

function Edit() {
  return (
    <>
      <p>edit</p>
      <DialogFooter>
        <Button type="submit">Submit</Button>
      </DialogFooter>
    </>
  );
}
