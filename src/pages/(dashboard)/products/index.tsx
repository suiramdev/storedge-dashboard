import CreateProductDialog from "@/components/dialogs/CreateProductDialog";
import { Button } from "@/components/ui/button";
import ProductsTable from "./_components/ProductsTable";

function ProductsPage() {
  return (
    <>
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">All products</h1>
        <CreateProductDialog>
          <Button>Create product</Button>
        </CreateProductDialog>
      </div>
      <ProductsTable />
    </>
  );
}

export default ProductsPage;
