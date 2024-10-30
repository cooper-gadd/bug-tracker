import { BASE_URL } from "@/constants";
import useSWR from "swr";

type ProjectUsers = {
  id: number;
  name: string;
};

export const useProjectUsers = ({ projectId }: { projectId: number }) => {
  const { data, isLoading, error } = useSWR<ProjectUsers[]>(
    `${BASE_URL}/api/users/project/${projectId}`,
  );
  return { data, isLoading, error };
};
