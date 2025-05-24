
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const addCodeFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  code: z.string().min(1, { message: "Promo code is required." }),
  expiry: z.date().optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});

type AddCodeFormValues = z.infer<typeof addCodeFormSchema>;

interface AddCodeFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmitCode: (data: AddCodeFormValues) => void;
  formTitle?: string; // To display context like "Add Code to E-commerce"
}

export default function AddCodeForm({ isOpen, setIsOpen, onSubmitCode, formTitle = "Add New Promo Code" }: AddCodeFormProps) {
  const form = useForm<AddCodeFormValues>({
    resolver: zodResolver(addCodeFormSchema),
    defaultValues: {
      title: "",
      code: "",
      expiry: undefined,
      description: "",
    },
  });

  const handleSubmit = (data: AddCodeFormValues) => {
    onSubmitCode(data);
    form.reset(); // Reset form after submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>
            Fill in the details for the new promo code. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 20% Off Summer Sale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promo Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SUMMER20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiry"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiry Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
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
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setDate(new Date().getDate() -1)) // Disable past dates
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                      placeholder="Describe the promo code, its benefits, and any conditions (e.g., payment method, account type)."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" /> Save Code
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
