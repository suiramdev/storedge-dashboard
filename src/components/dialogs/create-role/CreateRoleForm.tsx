import { gql, useMutation } from "@apollo/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon, ListChecksIcon } from "lucide-react";

const CREATE_ROLE = gql`
  mutation CreateRole($data: RoleCreateInput!) {
    createOneRole(data: $data) {
      id
      name
    }
  }
`;

const availableScopes = ["create:product", "delete:product", "write:product", "create:store", "delete:store"];

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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full">
                  <span>{form.watch("scopes").length} scopes selected</span>
                  <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                <Command>
                  <CommandList>
                    <CommandInput placeholder="Search a scope..." />
                    <CommandGroup>
                      <CommandItem onSelect={() => form.setValue("scopes", availableScopes)}>
                        <ListChecksIcon className="mr-2 h-4 w-4" />
                        Select all
                      </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup>
                      {availableScopes.map((scope) => (
                        <CommandItem key={scope}>
                          <span className="truncate">{scope}</span>
                          {form.watch("scopes").includes(scope) && <CheckIcon className="ml-auto h-4 w-4" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
