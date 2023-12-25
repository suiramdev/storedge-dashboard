import { gql, useMutation } from "@apollo/client";
import { z } from "zod";
import { CurrencyCode } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const CREATE_STORE = gql`
  mutation CreateStore($data: StoreCreateInput!) {
    createOneStore(data: $data) {
      id
      name
    }
  }
`;

const formSchema = z.object({
  name: z.string().trim().min(1, "Name must be at least 3 characters").max(255, "Name must not exceed 255 characters"),
  description: z.string().optional(),
  currencyCode: z.nativeEnum(CurrencyCode),
});

interface CreateStoreFormProps {
  onSubmit?: () => void;
  className?: string;
}

export function CreateStoreForm({ onSubmit, className }: CreateStoreFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      currencyCode: CurrencyCode.EUR,
    },
  });

  const [createStore] = useMutation(CREATE_STORE, {
    onCompleted: () => toast.success("Store created"),
    onError: (error) => toast.error(error.message),
    refetchQueries: ["Stores"],
  });

  const handleSubmit = form.handleSubmit((values) => {
    createStore({
      variables: {
        data: {
          name: values.name,
          description: values.description,
          currencyCode: values.currencyCode,
        },
      },
    });

    onSubmit?.();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={cn("flex flex-col space-y-4", className)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currencyCode"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EUR">Euro €</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
