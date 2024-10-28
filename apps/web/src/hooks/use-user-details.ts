import { UserDetailsTable } from "@/data/schema";
import useSWR from "swr";

export const useUserDetails = () => {
  const { data, isLoading, error } = useSWR<UserDetailsTable[]>(`/users`);
  return { data, isLoading, error };
};
