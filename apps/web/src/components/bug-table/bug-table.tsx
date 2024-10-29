import { useBugTable } from "@/hooks/use-bug-table";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export function BugTable() {
  const {
    data: bugs,
    isLoading: bugsLoading,
    error: bugsError,
  } = useBugTable();

  return (
    <>
      {bugsLoading && <p>Loading...</p>}
      {bugsError && <p>Error: {bugsError.message}</p>}
      {bugs && <DataTable data={bugs} columns={columns} />}
    </>
  );
}
