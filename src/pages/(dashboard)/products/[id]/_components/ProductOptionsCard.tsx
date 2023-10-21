import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function ProductOptionsCard() {
  const form = useFormContext();
  const options = useFieldArray({ control: form.control, name: "options" });

  return (
    <div className="col-span-3 space-y-4 rounded-lg border bg-background px-4 py-6">
      <div className="flex justify-between">
        <span className="text-sm font-semibold">Options</span>
        <Button type="button" variant="ghost" size="sm" onClick={() => options.append({ name: "" })}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add option
        </Button>
      </div>
      {options.fields.map((option, index) => (
        <div className="flex" key={option.id}>
          <FormField
            control={form.control}
            name={`options.${index}.name`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Option name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" variant="ghost" size="icon" className="ml-2" onClick={() => options.remove(index)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

export default ProductOptionsCard;
