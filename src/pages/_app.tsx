import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apollo";
import { ThemeProvider } from "@/components/providers/theme";
import { Modals } from "@generouted/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider defaultTheme="light" storageKey="storedge-theme">
        <Modals />
        <Toaster />
        <Outlet />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
