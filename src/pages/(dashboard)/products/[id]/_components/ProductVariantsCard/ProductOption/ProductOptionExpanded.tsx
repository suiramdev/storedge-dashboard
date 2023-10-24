import { ProductOption } from "@/types";
import { useFormContext, useFieldArray } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { GripVerticalIcon, TrashIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProductOptionExpandedProps {
  index: number;
  onSave?: () => void;
  onDelete?: () => void;
  className?: string;
}

function ProductOptionExpanded({ index, onSave, onDelete, className }: ProductOptionExpandedProps) {
  const form = useFormContext();
  const option: ProductOption = form.watch(`options.${index}`);
  const values = useFieldArray({ control: form.control, name: `options.${index}.values` });

  const handleNewValue = (event: ChangeEvent<HTMLInputElement>) => {
    values.append({ id: uuid(), value: event.target.value });
    event.target.value = "";
  };

  const handleSave = async () => {
    const saved = await form.trigger(`options.${index}`);
    if (saved)
      onSave?.();
  };

  return option && (
    <div className={className}>
      <div className="mb-4 flex space-x-4">
        <Button type="button" variant="ghost" size="icon">
          <GripVerticalIcon className="h-4 w-4" />
        </Button>
        <FormField
          control={form.control}
          name={`options.${index}.name`}
          render={({ field }) => (
            <FormItem className="flex-1 space-y-1">
              <FormControl>
                <Input placeholder="Option name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" variant="outline" size="icon" onClick={onDelete}>
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="pl-6">
        <div className="mb-4 space-y-2">
          {values.fields.map((value, valueIndex) => (
            <div className="flex space-x-4" key={value.id}>
              <Button type="button" variant="ghost" size="icon">
                <GripVerticalIcon className="h-4 w-4" />
              </Button>
              <FormField
                control={form.control}
                name={`options.${index}.values.${valueIndex}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-1">
                    <FormControl>
                      <Input placeholder="Option value" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="outline" size="icon" onClick={() => values.remove(valueIndex)}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex space-x-4">
            <Button type="button" variant="ghost" size="icon">
              <GripVerticalIcon className="h-4 w-4" />
            </Button>
            <Input onChange={handleNewValue} placeholder="Option name" className="flex-1" />
            <div className="h-10 w-10" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10" />
          <Button type="button" size="sm" className="ml-14" onClick={handleSave}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductOptionExpanded;
