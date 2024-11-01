import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_URL } from "@/constants";
import { bugTableSchema } from "@/data/schema";
import { useProjectUsers } from "@/hooks/use-project-users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { z } from "zod";

export function AssignForm({
  bug,
}: {
  bug: ReturnType<typeof bugTableSchema.parse>;
}) {
  const {
    data: projectUsers,
    isLoading: projectUsersLoading,
    error: projectUsersError,
  } = useProjectUsers({
    projectId: bug.projectId,
  });
  const formSchema = z.object({
    assignToId: z.number({
      required_error: "Please select an assignee",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignToId: bug.assignedToId ?? 0,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await fetch(`${BASE_URL}/api/assign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bugId: bug.id,
        assignedToId: data.assignToId,
      }),
    });
    mutate(`${BASE_URL}/api/bugs`);
    toast(`Bug has been assigned.`);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="assignToId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an assignee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={bug.assignedToId?.toString() || "0"}>
                    {bug.assignedTo || "Unassigned"}
                  </SelectItem>
                  {projectUsersLoading && (
                    <SelectItem disabled value="loading...">
                      Loading...
                    </SelectItem>
                  )}
                  {projectUsersError && (
                    <SelectItem disabled value="error">
                      Error loading assignees
                    </SelectItem>
                  )}
                  {projectUsers?.map(
                    (user) =>
                      user.id !== bug.assignedToId && (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ),
                  )}
                </SelectContent>
              </Select>
              <FormDescription>Assign the bug to a team member</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Assign</Button>
      </form>
    </Form>
  );
}
