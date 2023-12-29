import { gql } from "@apollo/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { apolloClient } from "@/lib/apollo";
import { toast } from "sonner";

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
  selectedStoreId: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  selectStore: (id: string | null) => Promise<void>;
}

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
  query SelectStore($id: String!) {
    store(where: { id: $id }) {
      id
    }
  }
`;

export const useSession = create<SessionState>()(
  devtools(
    persist(
      (set, get) => ({
        status: SessionStatus.UNAUTHENTICATED,
        selectedStoreId: null,
        signIn: async (email, password) => {
          set({ status: SessionStatus.LOADING });

          try {
            const { data } = await apolloClient.mutate({
              mutation: SIGN_IN,
              variables: { email, password },
            });

            set({
              tokens: {
                access: data.generateToken.accessToken,
                refresh: data.generateToken.refreshToken,
              },
              status: SessionStatus.AUTHENTICATED,
            });

            const { selectStore, selectedStoreId } = get();
            selectStore(selectedStoreId);

            toast.success("Signed in");
          } catch (error: any) {
            set({
              tokens: undefined,
              status: SessionStatus.UNAUTHENTICATED,
            });

            toast.error("Could not sign in", {
              description: error.message,
            });
          }
        },
        signOut: async () => {
          await apolloClient.mutate({ mutation: SIGN_OUT });

          set({
            tokens: undefined,
            status: SessionStatus.UNAUTHENTICATED,
          });

          toast.success("Signed out");
        },
        selectStore: async (id) => {
          if (!id) {
            set({ selectedStoreId: null });
            return;
          }

          try {
            const { data } = await apolloClient.query({ query: SELECT_STORE, variables: { id } });
            set({ selectedStoreId: data.store.id });
          } catch (error) {
            set({ selectedStoreId: null });
          }
        },
      }),
      { name: "session" },
    ),
  ),
);
