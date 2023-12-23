import { Role } from "@/types";
import { CreateRoleDialog } from "@/components/dialogs/create-role";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import RolesCardTable from "./RolesCardTable";

interface RolesCardProps {
  onRoleRemoved?: (role: Role) => void;
}

function RolesCard({ onRoleRemoved }: RolesCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4 rounded-lg border bg-background px-4 py-6">
        <div className="flex justify-between">
          <span className="text-sm font-semibold">Roles</span>
          <CreateRoleDialog>
            <Button type="button" variant="outline" size="sm">
              <PlusIcon className="mr-2 h-4 w-4" /> Add role
            </Button>
          </CreateRoleDialog>
        </div>
        <RolesCardTable onRoleRemoved={onRoleRemoved} />
      </div>
    </div>
  );
}

export default RolesCard;
