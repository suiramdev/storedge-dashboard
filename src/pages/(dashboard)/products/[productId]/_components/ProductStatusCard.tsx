import { useFormContext } from "react-hook-form";
import { useNavigate } from "@/router";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductStatus } from "@/types";
import { DeleteProductDialog } from "@/components/dialogs/delete-product";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

function ProductStatusCard() {
  const form = useFormContext();
  const navigate = useNavigate();

  return (
    <div className="space-y-4 rounded-lg border bg-background px-4 py-6">
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={ProductStatus.DRAFT}>{ProductStatus.DRAFT}</SelectItem>
                <SelectItem value={ProductStatus.PUBLISHED}>{ProductStatus.PUBLISHED}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="stock"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Stock amount</FormLabel>
            <FormControl>
              <Input placeholder="Amount" min="0" step="1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <DeleteProductDialog id={form.watch("id")} onCompleted={() => navigate("/products")}>
        <Button type="button" variant="destructive" className="w-full">
          <TrashIcon className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DeleteProductDialog>
    </div>
  );
}

export default ProductStatusCard;
