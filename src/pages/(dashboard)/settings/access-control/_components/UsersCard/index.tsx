import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import RolesCardTable from "./UsersCardTable";

function UsersCard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4 rounded-lg border bg-background px-4 py-6">
        <div className="flex justify-between">
          <span className="text-sm font-semibold">Users</span>
          <Button type="button" variant="outline" size="sm">
            <PlusIcon className="mr-2 h-4 w-4" /> Add user
          </Button>
        </div>
        <RolesCardTable />
      </div>
    </div>
  );
}

export default UsersCard;
