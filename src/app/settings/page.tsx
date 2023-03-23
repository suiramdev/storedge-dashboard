import { HiOutlineSave } from "react-icons/hi";

export default function Page() {
  return (
    <section>
      <div className="mb-6 flex justify-between">
        <h1>Settings</h1>
        <button className="btn btn-primary">
          <HiOutlineSave size={16} />
          Save changes
        </button>
      </div>
    </section>
  );
}
