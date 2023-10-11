import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  // useParams,
  Link,
  useModals,
} from "@/router";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeftIcon, TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductStatus } from "@/types";

const formSchema = z.object({
  name: z.string().trim().min(3).max(255),
  description: z.string(),
  status: z.enum([ProductStatus.PUBLISHED, ProductStatus.DRAFT]),
});

function ProductPage() {
  // const { id } = useParams("/products/:id");
  const modals = useModals();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: ProductStatus.DRAFT,
    },
  });

  const handleSubmit = form.handleSubmit((data) => console.log(data));

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-full flex justify-between">
            <Button variant="ghost" asChild>
              <Link to="/products">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to products
              </Link>
            </Button>
            <Button>Save changes</Button>
          </div>
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
          </div>
          <div className="col-span-2 h-fit space-y-4 rounded-lg border bg-background px-4 py-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={() => modals.open("/products/[id]/delete")}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default ProductPage;
