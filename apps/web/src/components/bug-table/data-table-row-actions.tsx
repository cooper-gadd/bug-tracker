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
        {action === "info" && <Info />}
        {action === "edit" && <Edit />}
        {action === "assign" && <Assign />}
        {action === "close" && <Close />}
      </DialogContent>
    </Dialog>
  );
}

function Info() {
  return (
    <>
      <p>info</p>
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

function Assign() {
  return (
    <>
      <p>assign</p>
      <DialogFooter>
        <Button type="submit">Submit</Button>
      </DialogFooter>
    </>
  );
}

function Close() {
  return (
    <>
      <p>close</p>
      <DialogFooter>
        <Button type="submit">Submit</Button>
      </DialogFooter>
    </>
  );
}
