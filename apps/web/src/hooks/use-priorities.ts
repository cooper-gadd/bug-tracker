import { BASE_URL } from "@/constants";
import { Priority } from "@/data/schema";
import useSWR from "swr";

export const usePriorities = () => {
  const { data, isLoading, error } = useSWR<Priority[]>(
    `${BASE_URL}/api/priorities`,
  );
  return { data, isLoading, error };
};
