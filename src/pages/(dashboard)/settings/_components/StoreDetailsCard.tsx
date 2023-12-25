import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StoreDetailsCard() {
  const form = useFormContext();

  return (
    <div className="space-y-4 rounded-lg border bg-background px-4 py-6">
      <span className="text-sm font-semibold">Store details</span>
      <FormField
        control={form.control}
        name="store.name"
        render={({ field }) => (
          <FormItem className="space-y-2">
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
        name="store.description"
        render={({ field }) => (
          <FormItem className="space-y-2">
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
        name="store.currencyCode"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Currency</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="EUR">Euro €</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
