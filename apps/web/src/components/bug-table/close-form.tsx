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
import { BASE_URL } from "@/constants";
import { bugTableSchema } from "@/data/schema";
import { toast } from "sonner";
import { mutate } from "swr";

const formSchema = z.object({
  fixDescription: z.string({
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
      fixDescription: bug.fixDescription || "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    await fetch(`${BASE_URL}/api/close`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bugId: bug.id,
        fixDescription: data.fixDescription,
      }),
    });
    mutate(`${BASE_URL}/api/bugs`);
    toast("Bug has been closed.");
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fixDescription"
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
