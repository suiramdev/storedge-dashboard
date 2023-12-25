import { gql, useMutation } from "@apollo/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/layout";

const CREATE_ROLE = gql`
  mutation CreateRole($data: RoleCreateInput!) {
    createOneRole(data: $data) {
      id
      name
    }
  }
`;

const availableScopes = [
  "create:store",
  "update:store",
  "delete:store",
  "create:collection",
  "update:collection",
  "delete:collection",
  "create:product",
  "update:product",
  "delete:product",
  "create:role",
  "update:role",
  "delete:role",
  "create:user",
  "update:user",
  "delete:user",
];

const formSchema = z.object({
  name: z.string().trim().min(1, "Name must be at least 3 characters").max(255, "Name must not exceed 255 characters"),
  scopes: z.array(z.string()).default([]),
});

interface CreateRoleFormProps {
  onSubmit?: () => void;
  className?: string;
}

export function CreateRoleForm({ onSubmit, className }: CreateRoleFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      scopes: [],
    },
  });

  const [createRole] = useMutation(CREATE_ROLE, {
    onCompleted: () => toast.success("Role created"),
    onError: (error) => toast.error(error.message),
    refetchQueries: ["Roles"],
  });

  const handleSubmit = form.handleSubmit((values) => {
    createRole({
      variables: {
        data: {
          name: values.name,
          scopes: { set: values.scopes },
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
        <FormItem className="space-y-2">
          <FormLabel>Scopes</FormLabel>
          <FormControl>
            <TagInput
              availableTags={availableScopes}
              selectedTags={form.watch("scopes")}
              onSelectedTagsChange={(tags) => form.setValue("scopes", tags)}
              placeholder=""
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
