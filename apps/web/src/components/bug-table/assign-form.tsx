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
import { bugTableSchema } from "@/data/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function AssignForm({
  bug,
}: {
  bug: ReturnType<typeof bugTableSchema.parse>;
}) {
  const formSchema = z.object({
    assignTo: z.string({
      required_error: "Please select an assignee",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignTo: bug.assignedTo ?? "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    toast(`Bug has been assigned to ${data.assignTo}.`);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="assignTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an assignee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={bug.assignedTo || "Unassgined"}>
                    {bug.assignedTo || "Unassgined"}
                  </SelectItem>
                  <SelectItem value="joe">joe</SelectItem>
                  <SelectItem value="jeff">jeff</SelectItem>
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
