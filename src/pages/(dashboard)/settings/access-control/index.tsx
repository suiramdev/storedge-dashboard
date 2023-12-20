import { gql, useQuery } from "@apollo/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import RolesCard from "./_components/RolesCard";
import UsersCard from "./_components/UsersCard";
import { roleModel, userModel } from "@/types";

const ACCCESS_CONTROL_SETTINGS = gql`
  query AccessControlSettings {
    roles {
      id
      name
      scopes
    }
    users {
      id
      email
      role {
        name
      }
      persistent
    }
  }
`;

const formSchema = z.object({
  roles: z.array(roleModel),
  users: z.array(userModel),
});

function AccessControlSettingsPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roles: [],
      users: [],
    },
  });

  useQuery(ACCCESS_CONTROL_SETTINGS, {
    onCompleted: (data) => {
      form.reset(data);
    },
  });

  const handleSubmit = form.handleSubmit(
    (data) => {
      form.reset(data);
    },
    (errors) => console.log(errors),
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <h2>Access control</h2>
          <Button disabled={!form.formState.isDirty} type="submit">
            Save changes
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-4">
          <RolesCard />
          <UsersCard />
        </div>
      </form>
    </Form>
  );
}

export default AccessControlSettingsPage;
