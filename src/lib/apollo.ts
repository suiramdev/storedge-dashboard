import { ApolloLink, gql, fromPromise, HttpLink, from, ApolloClient, InMemoryCache } from "@apollo/client";
import { useSession, SessionStatus } from "@/providers/session";
import { onError } from "@apollo/client/link/error";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = useSession.getState().tokens?.access;

  operation.setContext({
    headers: {
      authorization: accessToken && `Bearer ${accessToken}`,
    },
  });

  return forward(operation);
});

const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshtoken) {
      accessToken
      refreshToken
    }
  }
`;

const refreshToken = async () => {
  const refreshToken = useSession.getState().tokens?.refresh;

  const { data } = await apolloClient.mutate({ mutation: REFRESH_TOKEN, variables: { refreshToken } });

  if (!data?.refreshToken) {
    useSession.setState({
      tokens: undefined,
      status: SessionStatus.UNAUTHENTICATED,
    });

    return;
  }

  useSession.setState({
    tokens: {
      access: data.refreshToken.accessToken,
      refresh: data.refreshToken.refreshToken,
    },
  });
};

const errorLink = onError(({ graphQLErrors, forward, operation }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions.code == "UNAUTHENTICATED") {
        return fromPromise(refreshToken()).flatMap(() => {
          const accessToken = useSession.getState().tokens?.access;

          const oldHeaders = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...oldHeaders,
              authorization: accessToken ? `Bearer ${accessToken}` : "",
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
