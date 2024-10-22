import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { bugTableSchema } from "@/data/schema";

const formSchema = z.object({
  fixedDescription: z.string({
    required_error: "Please enter a description.",
  }),
});

export function CloseForm({
  bug,
}: {
  bug: ReturnType<typeof bugTableSchema.parse>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fixedDescription: bug.fixedDescription || "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    toast("Bug has been closed.");
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fixedDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fixed Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a description..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This description explains how the bug was fixed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Close</Button>
      </form>
    </Form>
  );
}
