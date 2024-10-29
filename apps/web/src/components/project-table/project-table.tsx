import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useProjects } from "@/hooks/use-projects";

export function ProjectTable() {
  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjects();

  return (
    <>
      {projectsLoading && <p>Loading...</p>}
      {projectsError && <p>Error: {projectsError.message}</p>}
      {projects && <DataTable data={projects} columns={columns} />}
    </>
  );
}
