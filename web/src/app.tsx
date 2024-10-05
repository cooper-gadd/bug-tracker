import { columns } from "@/components/bug-table/columns";
import { DataTable } from "@/components/bug-table/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { BugTable } from "@/data/schema";
import React from "react";

export default function App() {
  const [table, setTable] = React.useState("bugs");
  const bugs: BugTable[] = [
    {
      id: 1,
      summary: "Minor UI glitch",
      description: "Small visual inconsistency in the dashboard",
      project: "Project Alpha",
      owner: "Alice Johnson",
      assignedTo: null,
      status: "Unassigned",
      priority: "Low",
      dateRaised: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      targetDate: null,
      dateClosed: null,
      fixedDescription: null,
    },
    {
      id: 2,
      summary: "Performance issue in search function",
      description: "Search results are loading slowly for large datasets",
      project: "Project Alpha",
      owner: "Bob Smith",
      assignedTo: "Charlie Davis",
      status: "Assigned",
      priority: "Medium",
      dateRaised: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      dateClosed: null,
      fixedDescription: null,
    },
    {
      id: 3,
      summary: "Data inconsistency in reports",
      description: "Monthly reports showing incorrect totals",
      project: "Project Beta",
      owner: "Diana Evans",
      assignedTo: "Ethan Foster",
      status: "Closed",
      priority: "High",
      dateRaised: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      targetDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      dateClosed: new Date(),
      fixedDescription: "Corrected calculation logic in reporting module",
    },
    {
      id: 4,
      summary: "Critical security vulnerability",
      description: "Potential data breach in user authentication system",
      project: "Project Gamma",
      owner: "Frank Miller",
      assignedTo: "Grace Taylor",
      status: "Assigned",
      priority: "Urgent",
      dateRaised: new Date(), // Today
      targetDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      dateClosed: null,
      fixedDescription: null,
    },
  ];

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            {table === "users"
              ? "Here's a list of all the users in your system."
              : table === "projects"
                ? "Here's a list of all the projects in your system."
                : "Here's a list of your bugs that need to be squashed."}
          </p>
        </div>
        {/*
          TODO: Add user data from context
          TODO: Display options based on user role
          TODO: Add logout functionality
        */}
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="https://avatar.vercel.sh/cooper"
                    alt="@cooper"
                  />
                  <AvatarFallback>CG</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Cooper</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    cooper@rit.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setTable("bugs")}>
                  Bugs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTable("projects")}>
                  Projects
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTable("users")}>
                  Users
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <DataTable
        data={[
          ...bugs,
          ...bugs,
          ...bugs,
          ...bugs,
          ...bugs,
          ...bugs,
          ...bugs,
          ...bugs,
          ...bugs,
          ...bugs,
        ]}
        columns={columns}
      />
      <Toaster />
    </div>
  );
}
