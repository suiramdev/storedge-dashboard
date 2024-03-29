import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { apolloClient } from "@/lib/apollo";
import { gql } from "@apollo/client";

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
  selectStore: (id: string | null) => Promise<void>;
}

export const useSession = create<SessionState>()(
  devtools(
    persist(
      (set, _) => ({
        status: SessionStatus.UNAUTHENTICATED,
        selectedStoreId: null,
        selectStore: async (id) => {
          if (!id) {
            set({ selectedStoreId: null });
            console.error("Undefined ID");
            return;
          }

          try {
            await apolloClient.query({
              query: gql`
                query SelectStore($id: String!) {
                  store(where: { id: $id }) {
                    id
                  }
                }
              `,
              variables: { id },
            });
            set({ selectedStoreId: id });
            apolloClient.resetStore();
          } catch (error) {
            console.error(error);
            set({ selectedStoreId: null });
          }
        },
      }),
      { name: "session" },
    ),
  ),
);
