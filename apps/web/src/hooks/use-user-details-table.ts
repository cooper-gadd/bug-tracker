import { BASE_URL } from "@/constants";
import { UserDetailsTable } from "@/data/schema";
import useSWR from "swr";

export const useUserDetailsTable = () => {
  const { data, isLoading, error } = useSWR<UserDetailsTable[]>(
    `${BASE_URL}/api/users`,
  );
  return { data, isLoading, error };
};
