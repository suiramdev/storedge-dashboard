import { useSession, SessionStatus } from "@/components/providers/SessionProvider";
import LoginPage from "../_login";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  const { status } = useSession();

  return status == SessionStatus.AUTHENTICATED ? (
    <div className="relative flex min-h-screen flex-col">
      <Topbar />
      <div className="grid flex-1 grid-cols-1 gap-2 p-2 pt-0 lg:grid-cols-5">
        <Sidebar />
        <div className="rounded-lg border bg-primary-foreground px-4 py-6 lg:col-span-4">
          <Outlet />
        </div>
      </div>
    </div>
  ) : <LoginPage />;
}

export default Layout;
