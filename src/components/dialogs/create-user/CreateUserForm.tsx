import { gql, useMutation } from "@apollo/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CREATE_USER = gql`
  mutation CreateUser($data: UserCreateInput!) {
    createOneUser(data: $data) {
      id
      email
    }
  }
`;

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface CreateUserFormProps {
  onSubmit?: () => void;
  className?: string;
}

export function CreateUserForm({ onSubmit, className }: CreateUserFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: () => toast.success("User created"),
    onError: (error) => toast.error(error.message),
    refetchQueries: ["Users"],
  });

  const handleSubmit = form.handleSubmit((values) => {
    createUser({
      variables: {
        data: {
          email: values.email,
          password: values.password,
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
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
