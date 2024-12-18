import { Button } from "@/components/ui/button";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_URL } from "@/constants";
import { useProjects } from "@/hooks/use-projects";
import { useRoles } from "@/hooks/use-roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().max(50, { message: "Username is required." }),
  roleId: z.number().int().positive(),
  projectId: z.number().int().positive().nullable(),
  password: z.string().max(100, { message: "Password is required." }),
  name: z.string().max(250, { message: "Name is required." }),
});

export function UserDetailsForm() {
  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjects();
  const {
    data: roles,
    isLoading: rolesLoading,
    error: rolesError,
  } = useRoles();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      roleId: 3,
      projectId: null,
      password: "",
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await fetch(`${BASE_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    mutate(`${BASE_URL}/api/users`);
    toast(`${data.name} has been created.`);
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 flex">
          <User className="mr-2 h-4 w-4" />
          New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New User</DialogTitle>
          <DialogDescription>
            Enter the details for the new user.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rolesLoading && (
                        <SelectItem disabled value={""}>
                          Loading...
                        </SelectItem>
                      )}
                      {rolesError && (
                        <SelectItem disabled value={""}>
                          Error loading roles
                        </SelectItem>
                      )}
                      {roles &&
                        roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.role}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("roleId") === 3 && (
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString() || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projectsLoading && (
                          <SelectItem disabled value={""}>
                            Loading...
                          </SelectItem>
                        )}
                        {projectsError && (
                          <SelectItem disabled value={""}>
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
            )}

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
