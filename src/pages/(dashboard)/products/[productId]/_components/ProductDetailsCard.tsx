import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function ProductDetailsCard() {
  const form = useFormContext();

  return (
    <div className="col-span-3 space-y-4 rounded-lg border bg-background px-4 py-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="Price"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input type="number" min="0" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default ProductDetailsCard;
