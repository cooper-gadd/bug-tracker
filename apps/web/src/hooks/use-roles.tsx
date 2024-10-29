import { BASE_URL } from "@/constants";
import { Role } from "@/data/schema";
import useSWR from "swr";

export const useRoles = () => {
  const { data, isLoading, error } = useSWR<Role[]>(`${BASE_URL}/api/roles`);
  return { data, isLoading, error };
};
