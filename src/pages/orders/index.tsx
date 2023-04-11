import { OrderRow, OrderStatus } from "@/types/tables/order";
import { OrderTable } from "@/components/Order";
import { HiPlus } from "react-icons/hi";

const data: OrderRow[] = [
  {
    id: "1234",
    customer: "John Doe",
    total: 12.34,
    status: OrderStatus.PENDING,
  },
];

function OrdersPage() {
  return (
    <section className="flex flex-col rounded-sm border border-gray-200 bg-white">
      <div className="flex justify-between p-6">
        <h2>All Orders</h2>
        <button className="btn btn-primary">
          <HiPlus size={16} />
          Add an order
        </button>
      </div>
      <OrderTable data={data} />
    </section>
  );
}

export default OrdersPage;
