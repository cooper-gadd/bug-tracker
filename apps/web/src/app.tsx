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
import React from "react";
import { BugTable } from "./components/bug-table/bug-table";
import { UserDetailsTable } from "./components/user-details-table/user-details-table";
import { ProjectTable } from "./components/project-table/project-table";
import { useCurrentUser } from "./hooks/use-current-user";
import { LoginForm } from "./components/login-form";
import { mutate } from "swr";
import { BASE_URL } from "./constants";

export default function App() {
  const [table, setTable] = React.useState("bugs");
  const {
    data: currentUser,
    isLoading: currentUserLoading,
    error: currentUserError,
  } = useCurrentUser();

  async function handleLogout() {
    await fetch(`${BASE_URL}/api/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setTable("bugs");
    mutate(`${BASE_URL}/api/current-user`);
    mutate(`${BASE_URL}/api/bugs`);
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8">
      {currentUserLoading && <p>Loading...</p>}
      {currentUserError && <LoginForm />}
      {!currentUserLoading && !currentUserError && currentUser && (
        <>
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back!
              </h2>
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
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${currentUser.name}`}
                        alt={currentUser.name}
                      />
                      <AvatarFallback>User</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.project || currentUser.username}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setTable("bugs")}>
                      Bugs
                    </DropdownMenuItem>
                    {(currentUser.role === "Admin" ||
                      currentUser.role === "Manager") && (
                      <DropdownMenuItem onClick={() => setTable("projects")}>
                        Projects
                      </DropdownMenuItem>
                    )}
                    {currentUser.role === "Admin" && (
                      <DropdownMenuItem onClick={() => setTable("users")}>
                        Users
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {table === "bugs" && <BugTable />}
          {table === "projects" && <ProjectTable />}
          {table === "users" && <UserDetailsTable />}
        </>
      )}
      <Toaster />
    </div>
  );
}
