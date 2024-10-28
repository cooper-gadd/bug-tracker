import { UserDetailsTable } from "@/data/schema";
import useSWR from "swr";

export const useUserDetailsTable = () => {
  const { data, isLoading, error } = useSWR<UserDetailsTable[]>(`/users`);
  return { data, isLoading, error };
};
