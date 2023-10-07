import { ApolloLink, gql, fromPromise, HttpLink, from, ApolloClient, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("accessToken");

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });

  return forward(operation);
});

const REFRESH_TOKEN = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(refreshToken: $token) {
      accessToken
      refreshToken
    }
  }
`;

const refreshToken = async () => {
  const token = localStorage.getItem("refreshToken");

  const { data } = await apolloClient.mutate({ mutation: REFRESH_TOKEN, variables: { token } });

  localStorage.setItem("accessToken", data.refreshToken.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken.refreshToken);
};

const errorLink = onError(({ graphQLErrors, forward, operation }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions.code == "UNAUTHENTICATED") {
        return fromPromise(refreshToken()).flatMap(() => {
          const token = localStorage.getItem("accessToken");

          const oldHeaders = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...oldHeaders,
              authorization: token ? `Bearer ${token}` : "",
            },
          });

          return forward(operation);
        });
      }
    }
  }
});

const httpLink = new HttpLink({ uri: import.meta.env.VITE_API_URL });

export const apolloClient = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
});

loadErrorMessages();
loadDevMessages();
