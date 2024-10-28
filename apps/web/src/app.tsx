import { columns as bugColumns } from "@/components/bug-table/columns";
import { DataTable as BugsTable } from "@/components/bug-table/data-table";
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
import { columns as userDetailsColumns } from "@/components/user-details-table/columns";
import { DataTable as UsersTable } from "@/components/user-details-table/data-table";
import React from "react";
import { useUserDetailsTable } from "./hooks/use-user-details-table";
import { useBugTable } from "./hooks/use-bug-table";

export default function App() {
  const [table, setTable] = React.useState("bugs");
  const {
    data: bugs,
    isLoading: bugsLoading,
    error: bugsError,
  } = useBugTable();
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useUserDetailsTable();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          {table === "bugs" && (
            <p className="text-muted-foreground">
              Here's a list of your bugs that need to be squashed.
            </p>
          )}
          {table === "projects" && (
            <p className="text-muted-foreground">
              Here's a list of all the projects in your system.
            </p>
          )}
          {table === "users" && (
            <p className="text-muted-foreground">
              Here's a list of all the users in your system.
            </p>
          )}
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
      {table === "bugs" && (
        <>
          {bugsLoading && <p>Loading...</p>}
          {bugsError && <p>Error: {bugsError.message}</p>}
          {bugs && <BugsTable data={bugs} columns={bugColumns} />}
        </>
      )}
      {/* {table === "projects" && (
        <ProjectsTable data={projects} columns={projectColumns} />
      )} */}
      {table === "users" && (
        <>
          {usersLoading && <p>Loading...</p>}
          {usersError && <p>Error: {usersError.message}</p>}
          {users && <UsersTable data={users} columns={userDetailsColumns} />}
        </>
      )}
      <Toaster />
    </div>
  );
}
