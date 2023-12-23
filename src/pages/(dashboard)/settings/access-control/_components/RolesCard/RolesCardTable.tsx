import { createColumnHelper } from "@tanstack/react-table";
import { Role } from "@/types";
import { useFieldArray, useFormContext } from "react-hook-form";
import { DataTable, DataTableColumnHeader } from "@/components/layout/data-table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useMemo } from "react";
import { Link } from "@/router";

const columnHelper = createColumnHelper<Role>();

interface RolesCardTableProps {
  onRoleRemoved?: (role: Role) => void;
}

function RolesCardTable({ onRoleRemoved }: RolesCardTableProps) {
  const form = useFormContext();
  const roles = form.watch("roles");

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
        cell: ({ getValue }) => <Badge>{getValue()}</Badge>,
      }),
      columnHelper.accessor("scopes", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Scopes" />,
        cell: ({ getValue }) =>
          getValue().length > 0 && (
            <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
              <div className="flex w-max space-x-4 p-4">
                {getValue()?.map((scope) => <Badge variant="outline">{scope}</Badge>)}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ),
      }),
      columnHelper.display({
        id: "edit",
        header: undefined,
        cell: ({ row }) => {
          const form = useFormContext();
          const roles = useFieldArray({ control: form.control, name: "roles" });

          const handleRemove = () => {
            roles.remove(row.index);
            onRoleRemoved?.(row.original);
          };

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only"></span>
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link to="/settings/access-control/roles/:id" params={{ id: row.original.id }}>
                    <DropdownMenuItem>
                      <PencilIcon className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    className="hover:!bg-destructive hover:!text-destructive-foreground"
                    onClick={handleRemove}
                    disabled={row.original.persistent}
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
    [roles],
  );

  return <DataTable className="pt-4" data={roles} columns={columns} />;
}

export default RolesCardTable;
