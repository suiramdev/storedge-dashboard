import SessionProvider from "@/components/providers/SessionProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { Modals } from "@generouted/react-router";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="light" storageKey="storedge-theme">
        <Modals />
        <Outlet />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default App;
