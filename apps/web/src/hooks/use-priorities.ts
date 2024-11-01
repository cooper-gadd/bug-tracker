import { BASE_URL } from "@/constants";
import useSWR from "swr";

type Priority = {
  id: number;
  priority: "Low" | "Medium" | "High" | "Urgent";
};

export const usePriorities = () => {
  const { data, isLoading, error } = useSWR<Priority[]>(
    `${BASE_URL}/api/priorities`,
  );
  return { data, isLoading, error };
};
