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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

//TODO: Pass in id of bug to assign
export function AssignForm() {
  const formSchema = z.object({
    assignTo: z.string({
      required_error: "Please select an assignee",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //TODO: Get assignee from bug
      assignTo: "",
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
                  <SelectItem value="john">john</SelectItem>
                  <SelectItem value="joe">joe</SelectItem>
                  <SelectItem value="jeff">jeff</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Assign the bug to a team member</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
