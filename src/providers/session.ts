import { FetchResult, gql } from "@apollo/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { apolloClient } from "@/lib/apollo";

export enum SessionStatus {
  UNAUTHENTICATED,
  LOADING,
  AUTHENTICATED,
}

export interface SessionTokens {
  access: string;
  refresh: string;
}

interface SessionState {
  status: SessionStatus;
  tokens?: SessionTokens;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  selectedStoreId: string | null;
  selectStore: (id: string) => void;
}

// const SIGNED_IN = gql`
//   query SignedIn {
//     me {
//       id
//     }
//   }
// `;

const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    generateToken(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

const SIGN_OUT = gql`
  mutation SignOut {
    revokeToken
  }
`;

const SELECT_STORE = gql`
  query SelectStore($where: StoreWhereUniqueInput!) {
    store(where: $where) {
      id
    }
  }
`;

export const useSession = create<SessionState>()(
  devtools(
    persist(
      (set) => ({
        status: SessionStatus.UNAUTHENTICATED,
        tokens: undefined,
        signIn: (email, password) => {
          set({ status: SessionStatus.LOADING });

          apolloClient
            .mutate({ mutation: SIGN_IN, variables: { email, password } })
            .then(({ data }: FetchResult) => {
              set({
                tokens: {
                  access: data?.generateToken.accessToken,
                  refresh: data?.generateToken.refreshToken,
                },
                status: SessionStatus.AUTHENTICATED,
              });
            })
            .catch((error) => {
              set({
                tokens: undefined,
                status: SessionStatus.UNAUTHENTICATED,
              });

              console.log(error);
            });
        },
        signOut: () => {
          apolloClient.mutate({ mutation: SIGN_OUT });

          set({
            tokens: undefined,
            status: SessionStatus.UNAUTHENTICATED,
          });

          apolloClient.clearStore();
        },
        selectedStoreId: null,
        selectStore: (id) => {
          apolloClient
            .query({ query: SELECT_STORE, variables: { where: { id } } })
            .then(() => set({ selectedStoreId: id }))
            .catch(() => set({ selectedStoreId: null }));
        },
      }),
      { name: "session" },
    ),
  ),
);
