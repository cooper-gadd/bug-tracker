import { UserNav } from "@/components/user-nav";
import { DataTable } from "./components/bug-table/data-table";
import { Bug, columns } from "./components/bug-table/columns";

export default function App() {
  const bugs: Bug[] = [
    {
      id: 1,
      description: "This is a bug",
      summary: "Bug 1",
      project: {
        id: 1,
        name: "Project 1",
      },
      owner: {
        id: 1,
        name: "Owner 1",
      },
      assignedTo: {
        id: 1,
        name: "Assigned To 1",
      },
      status: "Backlog",
      priority: "Low",
      raised: new Date(),
      target: new Date(),
      closed: new Date(),
      fixedDescription: "Fixed Description",
    },
    {
      id: 2,
      description: "This is a bug",
      summary: "Bug 2",
      project: {
        id: 1,
        name: "Project 1",
      },
      owner: {
        id: 1,
        name: "Owner 1",
      },
      assignedTo: {
        id: 1,
        name: "Assigned To 1",
      },
      status: "Todo",
      priority: "Medium",
      raised: new Date(),
      target: new Date(),
      closed: new Date(),
      fixedDescription: "Fixed Description",
    },
    {
      id: 3,
      description: "This is a bug",
      summary: "Bug 3",
      project: {
        id: 1,
        name: "Project 1",
      },
      owner: {
        id: 1,
        name: "Owner 1",
      },
      assignedTo: {
        id: 1,
        name: "Assigned To 1",
      },
      status: "In Progress",
      priority: "High",
      raised: new Date(),
      target: new Date(),
      closed: new Date(),
      fixedDescription: "Fixed Description",
    },
    {
      id: 4,
      description: "This is a bug",
      summary: "Bug 4",
      project: {
        id: 1,
        name: "Project 1",
      },
      owner: {
        id: 1,
        name: "Owner 1",
      },
      assignedTo: {
        id: 1,
        name: "Assigned To 1",
      },
      status: "Done",
      priority: "Low",
      raised: new Date(),
      target: new Date(),
      closed: new Date(),
      fixedDescription: "Fixed Description",
    },
  ];

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your bugs for Whatever!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <UserNav />
        </div>
      </div>
      <DataTable data={bugs} columns={columns} />
    </div>
  );
}
