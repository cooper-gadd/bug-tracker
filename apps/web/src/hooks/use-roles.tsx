import { BASE_URL } from "@/constants";
import useSWR from "swr";

type Role = {
  id: number;
  role: "Admin" | "Manager" | "User";
};

export const useRoles = () => {
  const { data, isLoading, error } = useSWR<Role[]>(`${BASE_URL}/api/roles`);
  return { data, isLoading, error };
};
