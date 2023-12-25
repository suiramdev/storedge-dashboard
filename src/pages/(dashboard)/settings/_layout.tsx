import { Separator } from "@/components/ui/separator";
import { NavBar } from "./_components/NavBar";
import { Outlet } from "react-router-dom";

function SettingsLayout() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <Separator className="my-6" />
      <div className="flex flex-col gap-6 lg:flex-row">
        <NavBar className="lg:w-1/5" />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default SettingsLayout;
