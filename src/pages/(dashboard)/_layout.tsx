import { useSession, SessionStatus } from "@/providers/session";
import { useShallow } from "zustand/react/shallow";
import LoginPage from "@/pages/_login";
import StoreSelectionPage from "@/pages/_store-selection";
import { Topbar, Sidebar } from "@/components/layout";
import { Outlet } from "react-router-dom";

function Layout() {
  const { status, selectedStoreId } = useSession(
    useShallow((state) => ({ status: state.status, selectedStoreId: state.selectedStoreId })),
  );

  if (status !== SessionStatus.AUTHENTICATED) return <LoginPage />;
  if (!selectedStoreId) return <StoreSelectionPage />;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <Topbar />
      <div className="grid h-full grid-cols-1 gap-2 overflow-y-auto p-2 pt-0 lg:grid-cols-5">
        <Sidebar />
        <div className="transform overflow-y-scroll rounded-lg border bg-primary-foreground px-4 py-6 lg:col-span-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
