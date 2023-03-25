import { Logo } from "@/app/components/Icons";

export default function TopBar() {
  return (
    <div className="flex items-center justify-between border-b border-b-gray-200 bg-white p-6 shadow-sm">
      <Logo size={32} />
    </div>
  );
}
