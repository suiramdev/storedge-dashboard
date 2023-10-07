import { HttpLink, ApolloLink, concat, ApolloClient, InMemoryCache } from "@apollo/client";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

const httpLink = new HttpLink({ uri: import.meta.env.VITE_API_URL });

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("accessToken");

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});

loadErrorMessages();
loadDevMessages();
