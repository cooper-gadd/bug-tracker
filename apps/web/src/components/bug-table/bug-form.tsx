import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/constants";
import { useProjectUsers } from "@/hooks/use-project-users";
import { useProjects } from "@/hooks/use-projects";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Bug, CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { z } from "zod";

const formSchema = z.object({
  projectId: z.number().int().positive({ message: "Project is required" }),
  ownerId: z.number().int().positive({ message: "Owner is required" }),
  assignedToId: z.number().int().positive().nullable(),
  statusId: z.number().int().positive({ message: "Status is required" }),
  priorityId: z.number().int().positive({ message: "Priority is required" }),
  summary: z
    .string()
    .max(250, { message: "Summary must be 250 characters or less" }),
  description: z
    .string()
    .max(2500, { message: "Description must be 2500 characters or less" }),
  targetDate: z
    .date()
    .nullable()
    .refine((date) => !date || date > new Date(), {
      message: "Target date must be in the future",
    }),
});

export function BugForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: undefined,
      ownerId: 1, // Assuming the current user is the owner
      assignedToId: null,
      statusId: 1, // Assuming 1 is "Unassigned"
      priorityId: 2, // Assuming 2 is "Medium"
      summary: "",
      description: "",
      targetDate: null,
    },
  });
  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjects();
  const {
    data: projectUsers,
    isLoading: projectUsersLoading,
    error: projectUsersError,
  } = useProjectUsers({
    projectId: form.watch("projectId"),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    data.statusId = data.assignedToId ? 2 : 1;
    console.log(data);
    toast(`Bug "${data.summary}" created`);
    form.reset();
  }

  //TODO: if admin or manager, they can assign
  //TODO: if admin or manager, they can do target date
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 flex">
          <Bug className="mr-2 h-4 w-4" />
          New Bug
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Bug</DialogTitle>
          <DialogDescription>
            Enter the details for the new bug.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                      mutate(
                        `${BASE_URL}/api/users/project/${value.toString()}`,
                      );
                    }}
                    value={field.value?.toString() || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectsLoading && (
                        <SelectItem disabled value="loading">
                          Loading...
                        </SelectItem>
                      )}
                      {projectsError && (
                        <SelectItem disabled value="error">
                          Error loading projects
                        </SelectItem>
                      )}
                      {projects &&
                        projects.map((project) => (
                          <SelectItem
                            key={project.id}
                            value={project.id.toString()}
                          >
                            {project.project}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief summary of the bug" {...field} />
                  </FormControl>
                  <FormDescription>
                    A short description of the bug (max 250 characters).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the bug"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the bug (max 2500
                    characters).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignedToId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : null)
                    }
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectUsersLoading && (
                        <SelectItem disabled value="loading">
                          Loading...
                        </SelectItem>
                      )}
                      {projectUsersError && (
                        <SelectItem disabled value="error">
                          Error loading users
                        </SelectItem>
                      )}
                      {projectUsers &&
                        projectUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the user to assign this bug to (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priorityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Low</SelectItem>
                      <SelectItem value="2">Medium</SelectItem>
                      <SelectItem value="3">High</SelectItem>
                      <SelectItem value="4">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Target Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date <= new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The target date for resolving this bug (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
