import { gql, useQuery } from "@apollo/client";
import { HiPlus } from "react-icons/hi";
import { ProductRow } from "@/types/tables/product";
import { ProductTable } from "@/components/Product";

const GET_PRODUCTS = gql`
  query Products {
    products {
      id
      name
    }
  }
`;

function ProductsPage() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <section className="flex flex-col rounded-sm border border-gray-200 bg-white">
      <div className="flex justify-between p-6">
        <h2>All Products</h2>
        <button className="btn btn-primary">
          <HiPlus size={16} />
          Add a product
        </button>
      </div>
      <ProductTable
        data={data.products.map(
          (product: any) =>
            ({
              href: `/products/${product.id}`,
              ...product,
            } as ProductRow)
        )}
      />
    </section>
  );
}

export default ProductsPage;
