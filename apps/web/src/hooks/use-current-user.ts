import { BASE_URL } from "@/constants";
import useSWR from "swr";

type CurrentUser = {
  id: number;
  project: string | null;
  username: string;
  name: string;
  role: "Admin" | "Manager" | "User";
};

export const useCurrentUser = () => {
  const { data, error } = useSWR<CurrentUser>(
    `${BASE_URL}/api/current-user`,
    async (url: string | URL | Request) => {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Not logged in");
        }
        throw new Error("An error occurred while fetching the data.");
      }
      return response.json();
    },
  );

  return { data, isLoading: !error && !data, error };
};
