import { createColumnHelper } from "@tanstack/react-table";
import { User } from "@/types";
import { useFieldArray, useFormContext } from "react-hook-form";
import DataTableColumnHeader from "@/components/layout/DataTable/DataTableColumnHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/layout/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useMemo } from "react";

const columnHelper = createColumnHelper<User>();

interface UsersCardTableProps {
  onUserRemoved?: (user: User) => void;
}

function UsersCardTable({ onUserRemoved }: UsersCardTableProps) {
  const form = useFormContext();
  const users = form.watch("users");

  const columns = useMemo(
    () => [
      columnHelper.accessor("email", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="e-mail" />,
        cell: ({ getValue }) => (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://avatar.vercel.sh/DS.png`} />
              <AvatarFallback>
                <Skeleton />
              </AvatarFallback>
            </Avatar>
            <span>{getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("role.name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
        cell: ({ getValue }) => <Badge>{getValue()}</Badge>,
      }),
      columnHelper.display({
        id: "edit",
        header: undefined,
        cell: ({ row }) => {
          const form = useFormContext();
          const users = useFieldArray({ control: form.control, name: "users" });

          const handleRemove = () => {
            users.remove(row.index);
            onUserRemoved?.(row.original);
          };

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="hover:!bg-destructive hover:!text-destructive-foreground"
                    onClick={handleRemove}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      }),
    ],
    [users],
  );

  return <DataTable className="pt-4" data={users} columns={columns} />;
}

export default UsersCardTable;
