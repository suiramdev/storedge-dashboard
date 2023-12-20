import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function UsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2>Users</h2>
        <Button type="submit">Save changes</Button>
      </div>
      <Separator className="my-4" />
    </div>
  );
}

export default UsersPage;
