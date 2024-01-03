import { apolloClient } from "@/lib/apollo";
import { SessionStatus, useSession } from "./session";
import { gql } from "@apollo/client";

const signIn = async (email: string, password: string): Promise<void> => {
  try {
    useSession.setState((state) => ({
      ...state,
      status: SessionStatus.LOADING,
    }));

    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation SignIn($email: String!, $password: String!) {
          generateToken(email: $email, password: $password) {
            accessToken
            refreshToken
          }
        }
      `,
      variables: { email, password },
    });

    useSession.setState((state) => ({
      ...state,
      status: SessionStatus.AUTHENTICATED,
      tokens: {
        access: data.generateToken.accessToken,
        refresh: data.generateToken.refreshToken,
      },
    }));

    apolloClient.resetStore();
  } catch (error) {
    useSession.setState((state) => ({
      ...state,
      status: SessionStatus.UNAUTHENTICATED,
      tokens: undefined,
    }));
  }
};

const signOut = async (): Promise<void> => {
  await apolloClient.mutate({
    mutation: gql`
      mutation SignOut {
        revokeToken
      }
    `,
  });

  useSession.setState((state) => ({
    ...state,
    status: SessionStatus.UNAUTHENTICATED,
    tokens: undefined,
  }));

  apolloClient.resetStore();
};

export const useAuth = () => ({
  signIn,
  signOut,
});
