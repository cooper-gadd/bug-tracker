import { BugTable } from "@/data/schema";
import useSWR from "swr";

export const useBugTable = () => {
  const { data, isLoading, error } = useSWR<BugTable[]>(`/bugs`);
  data?.map((bug) => {
    bug.dateRaised = new Date(bug.dateRaised);
    bug.targetDate = bug.targetDate ? new Date(bug.targetDate) : null;
    bug.dateClosed = bug.dateClosed ? new Date(bug.dateClosed) : null;
  });
  return { data, isLoading, error };
};
