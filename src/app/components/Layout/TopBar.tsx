import { HiOutlineQuestionMarkCircle } from "react-icons/hi";

export default function TopBar() {
  return (
    <div className="flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-6 py-2">
      <div></div>
      <div className="items-self-end flex items-center">
        <HiOutlineQuestionMarkCircle size={24} className="text-gray-300" />
      </div>
    </div>
  );
}
