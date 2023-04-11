import "@/styles/globals.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Sidebar, Topbar } from "@/components/Layout";
import { Outlet } from "react-router-dom";

const client = new ApolloClient({
  uri: import.meta.env.VITE_API_URL,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Topbar />
      <div>
        <Sidebar />
        <main className="ml-64 mt-20 h-0 min-h-[calc(100vh-5rem)] p-6">
          <Outlet />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;
