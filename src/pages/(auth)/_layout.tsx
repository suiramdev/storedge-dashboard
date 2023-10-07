import { useSession } from "@/components/providers/SessionProvider";
import { Navigate } from "@/router";
import { Outlet } from "react-router-dom";

function Layout() {
  const { authenticated } = useSession();
  if (authenticated) return <Navigate to="/" replace />;

  return <Outlet />;
}

export default Layout;
