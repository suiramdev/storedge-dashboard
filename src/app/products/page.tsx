import { HiPlus } from "react-icons/hi";
import { ProductRow } from "@/types/tables/products";
import { ProductsTable } from "../components/Product";

const data: ProductRow[] = [
  {
    id: "1234",
    name: "Wool turtleneck jumper",
  },
  {
    id: "1234",
    name: "Wool turtleneck jumper",
  },
  {
    id: "1234",
    name: "Wool turtleneck jumper",
  },
];

export default function Page() {
  return (
    <section className="flex flex-col rounded-sm border border-gray-200 bg-white">
      <div className="flex justify-between p-6">
        <h2>All Products</h2>
        <button className="btn btn-primary">
          <HiPlus size={16} />
          Add a product
        </button>
      </div>
      <ProductsTable data={data} />
    </section>
  );
}
