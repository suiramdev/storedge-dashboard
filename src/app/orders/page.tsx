import { HiPlus } from "react-icons/hi";
import { OrdersTable } from "@/app/components/Order";

const data = [
  {
    id: "1234",
    customer: "John Doe",
    total: 12.34,
    status: "Processing",
  },
];

export default function Page() {
  return (
    <section>
      <div className="mb-6 flex justify-between">
        <h1>Orders</h1>
        <button className="btn btn-primary">
          <HiPlus size={16} />
          Add an order
        </button>
      </div>
      <OrdersTable data={data} />
    </section>
  );
}
