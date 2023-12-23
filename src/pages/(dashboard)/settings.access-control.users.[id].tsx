import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@/router";
import { useForm } from "react-hook-form";
import { User, relatedUserModel } from "@/types";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Link } from "@/router";
import { ArrowLeftIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function UserSettingsPage() {
  const { id } = useParams("/settings/access-control/users/:id");

  const form = useForm<User>({
    resolver: zodResolver(relatedUserModel),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = form.handleSubmit(
    (data) => console.log(data),
    (errors) => console.log(errors),
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <Button variant="ghost" asChild>
            <Link to="/settings/access-control">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to settings
            </Link>
          </Button>
          <Button disabled={!form.formState.isDirty} type="submit">
            Save changes
          </Button>
        </div>
        <Separator className="my-4" />
      </form>
    </Form>
  );
}

export default UserSettingsPage;
