import { columns } from "@/components/user-details-table/columns";
import { useUserDetailsTable } from "@/hooks/use-user-details-table";
import { DataTable } from "./data-table";

export function UserDetailsTable() {
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useUserDetailsTable();

  return (
    <>
      {usersLoading && <p>Loading...</p>}
      {usersError && <p>Error: {usersError.message}</p>}
      {users && <DataTable data={users} columns={columns} />}
    </>
  );
}
