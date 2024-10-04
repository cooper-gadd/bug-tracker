import { UserNav } from "@/components/user-nav";
import { DataTable } from "./components/bug-table/data-table";
import { Bug, columns } from "./components/bug-table/columns";

export default function App() {
  const bugs: Bug[] = [
    {
      id: 1,
      summary: "Minor UI glitch",
      description: "Small visual inconsistency in the dashboard",
      project: {
        id: 1,
        name: "Project Alpha",
      },
      owner: {
        id: 1,
        name: "Alice Johnson",
      },
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
      project: {
        id: 1,
        name: "Project Alpha",
      },
      owner: {
        id: 2,
        name: "Bob Smith",
      },
      assignedTo: {
        id: 3,
        name: "Charlie Davis",
      },
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
      project: {
        id: 2,
        name: "Project Beta",
      },
      owner: {
        id: 4,
        name: "Diana Evans",
      },
      assignedTo: {
        id: 5,
        name: "Ethan Foster",
      },
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
      project: {
        id: 3,
        name: "Project Gamma",
      },
      owner: {
        id: 6,
        name: "Frank Miller",
      },
      assignedTo: {
        id: 7,
        name: "Grace Taylor",
      },
      status: "Assigned",
      priority: "Urgent",
      dateRaised: new Date(), // Today
      targetDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      dateClosed: null,
      fixedDescription: null,
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
