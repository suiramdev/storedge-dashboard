import Link from "next/link";
import { HiReply, HiSave } from "react-icons/hi";

export default function Page() {
  return (
    <section>
      <div className="mb-6 flex justify-between">
        <Link
          className="flex items-center gap-2 text-gray-500 hover:underline hover:underline-offset-4"
          href="/products"
        >
          <HiReply size={16} />
          Back to products
        </Link>
        <button className="btn btn-primary">
          <HiSave size={16} />
          Save changes
        </button>
      </div>
    </section>
  );
}
