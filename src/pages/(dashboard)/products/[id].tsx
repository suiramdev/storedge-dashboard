import { useParams } from "@/router";

function ProductPage() {
  const { id } = useParams("/products/:id");

  return (
    <>
      <h1>{id}</h1>
      <span>WIP</span>
    </>
  );
}

export default ProductPage;
