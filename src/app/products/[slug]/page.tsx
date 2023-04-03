import Link from "next/link";
import { HiArrowNarrowLeft, HiSave, HiTrash } from "react-icons/hi";

export default function Page() {
  return (
    <section>
      <div className="mb-6 flex justify-between">
        <Link
          className="flex items-center gap-2 text-sm text-gray-500 hover:underline hover:underline-offset-4"
          href="/products"
        >
          <HiArrowNarrowLeft size={24} />
          Back to products
        </Link>
        <button className="btn btn-primary">
          <HiSave size={16} />
          Save changes
        </button>
      </div>
      <div className="grid grid-cols-8 gap-6">
        <div className="col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-6 rounded-sm border border-gray-200 bg-white p-6">
            <label className="input">
              Name
              <input type="text" />
            </label>
            <label className="input">
              Description
              <textarea />
            </label>
          </div>
        </div>
        <div className="col-span-3 flex flex-col gap-6">
          <div className="flex flex-col gap-6 rounded-sm border border-gray-200 bg-white p-6">
            <label className="input">
              Status
              <select>
                <option>Published</option>
                <option>Draft</option>
              </select>
            </label>
            <button className="btn btn-danger">
              <HiTrash size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
