import { BASE_URL } from "@/constants";
import useSWR from "swr";

type Project = {
  id: number;
  project: string;
};

export const useProjects = () => {
  const { data, isLoading, error } = useSWR<Project[]>(
    `${BASE_URL}/api/projects`,
  );
  return { data, isLoading, error };
};
