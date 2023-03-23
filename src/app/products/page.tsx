import { HiOutlinePlus } from "react-icons/hi";
import { ProductsTable } from "@/app/components/Product";

const data = [
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
    <section>
      <div className="mb-6 flex justify-between">
        <h1>Products</h1>
        <button className="btn btn-primary">
          <HiOutlinePlus size={24} />
          Add a product
        </button>
      </div>
      <ProductsTable data={data} />
    </section>
  );
}
