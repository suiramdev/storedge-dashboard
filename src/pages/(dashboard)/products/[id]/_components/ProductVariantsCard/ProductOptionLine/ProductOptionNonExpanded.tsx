import { useFormContext } from "react-hook-form";
import { ProductOption } from "@/types";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GripVerticalIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";

interface ProductOptionNonExpandedProps {
  index: number;
  onEdited?: (option: ProductOption) => void;
  onDeleted?: (option: ProductOption) => void;
  className?: string;
}

function ProductOptionNonExpanded({ index: optionIndex, onEdited, onDeleted, className }: ProductOptionNonExpandedProps) {
  const form = useFormContext();
  const option: ProductOption = form.watch(`options.${optionIndex}`);

  const handleEdit = () => {
    onEdited?.(option);
  };

  const handleDelete = () => {
    onDeleted?.(option);
  };

  return option && (
    <div className={clsx("flex items-center space-x-4", className)}>
      <Button type="button" variant="ghost" size="icon">
        <GripVerticalIcon className="h-4 w-4" />
      </Button>
      <div className="flex flex-1 flex-col">
        <span className="text-sm">{option.name}</span>
        {option.values.length > 0 && (
          <div className="mt-1 space-x-1">
            {option.values.map((value) => (
              <Badge variant="secondary" key={value.id}>{value.value}</Badge>
            ))}
          </div>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" size="icon">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:!bg-destructive hover:!text-destructive-foreground" onClick={handleDelete}>
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ProductOptionNonExpanded;
