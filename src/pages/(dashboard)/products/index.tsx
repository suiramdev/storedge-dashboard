import { Button } from "@/components/ui/button";
import ProductsTable from "./_components/ProductsTable";
import { useModals } from "@/router";

function ProductsPage() {
  const modals = useModals();

  return (
    <>
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">All products</h1>
        <Button onClick={() => modals.open("/new-product")}>Create product</Button>
      </div>
      <div>
        <ProductsTable />
      </div>
    </>
  );
}

export default ProductsPage;
