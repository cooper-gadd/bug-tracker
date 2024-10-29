import { BASE_URL } from "@/constants";
import { Project } from "@/data/schema";
import useSWR from "swr";

export const useProjects = () => {
  const { data, isLoading, error } = useSWR<Project[]>(
    `${BASE_URL}/api/projects`,
  );
  return { data, isLoading, error };
};
