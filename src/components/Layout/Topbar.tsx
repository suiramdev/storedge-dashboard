import Logo from "@/components/Logo";

function Topbar() {
  return (
    <div className="fixed left-0 top-0 flex h-20 w-full items-center justify-between border-b border-b-gray-200 bg-white p-6 shadow-sm">
      <Logo size={32} />
    </div>
  );
}

export default Topbar;
