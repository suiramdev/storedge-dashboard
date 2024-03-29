import { gql, useQuery, useMutation } from "@apollo/client";
import { z } from "zod";
import { roleModel, userModel } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { apolloClient } from "@/lib/apollo";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RolesCard } from "./_components/cards/roles";
import { UsersCard } from "./_components/cards/users";

const ACCCESS_CONTROL_SETTINGS = gql`
  query AccessControlSettings {
    roles {
      id
      name
      scopes
      persistent
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

const DELETE_ROLES = gql`
  mutation DeleteRoles($ids: [String!]!) {
    deleteManyRole(where: { id: { in: $ids } }) {
      count
    }
  }
`;

const DELETE_USERS = gql`
  mutation DeleteUsers($ids: [String!]!) {
    deleteManyUser(where: { id: { in: $ids } }) {
      count
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

  const [removedRoles, setRemovedRoles] = useState<string[]>([]);
  const [deleteRoles] = useMutation(DELETE_ROLES, {
    variables: {
      ids: removedRoles,
    },
    onError: (error) => toast.error(error.message),
  });

  const [removedUsers, setRemovedUsers] = useState<string[]>([]);
  const [deleteUsers] = useMutation(DELETE_USERS, {
    variables: {
      ids: removedUsers,
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = form.handleSubmit(
    () => {
      removedRoles.length > 0 && deleteRoles();
      removedUsers.length > 0 && deleteUsers();

      toast.success("Settings updated");

      apolloClient.refetchQueries({
        include: ["AccessControlSettings"],
      });
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
          <RolesCard onRoleRemoved={(role) => setRemovedRoles([role.id, ...removedRoles])} />
          <UsersCard onUserRemoved={(user) => setRemovedUsers([user.id, ...removedUsers])} />
        </div>
      </form>
    </Form>
  );
}

export default AccessControlSettingsPage;
