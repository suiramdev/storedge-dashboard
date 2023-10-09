import { useParams } from "@/router";

function ProductsPage() {
  const { id } = useParams("/products/:id");

  return (
    <>
      <h1>{id}</h1>
      <span>WIP</span>
    </>
  );
}

export default ProductsPage;
