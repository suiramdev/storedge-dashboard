import { User } from "@/types";
import { CreateUserDialog } from "@/components/dialogs/create-user";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import RolesCardTable from "./UsersCardTable";

interface UsersCardProps {
  onUserRemoved?: (user: User) => void;
}

function UsersCard({ onUserRemoved }: UsersCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4 rounded-lg border bg-background px-4 py-6">
        <div className="flex justify-between">
          <span className="text-sm font-semibold">Users</span>
          <CreateUserDialog>
            <Button type="button" variant="outline" size="sm">
              <PlusIcon className="mr-2 h-4 w-4" /> Add user
            </Button>
          </CreateUserDialog>
        </div>
        <RolesCardTable onUserRemoved={onUserRemoved} />
      </div>
    </div>
  );
}

export default UsersCard;
