"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  youtubeUrl: z.string().url("Please enter a valid URL").refine((url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  }, "Please enter a valid YouTube URL")
});

interface YouTubeFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  loading: boolean;
}

export function YouTubeForm({ onSubmit, loading }: YouTubeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      youtubeUrl: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="youtubeUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  placeholder="Enter YouTube URL" 
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Fetching Comments..." : "Get Comments"}
        </Button>
      </form>
    </Form>
  );
}