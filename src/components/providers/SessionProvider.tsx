import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { apolloClient } from "@/lib/apollo";

export enum SessionStatus {
  UNAUTHENTICATED,
  LOADING,
  AUTHENTICATED,
}

type SessionProviderState = {
  status: SessionStatus;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  selectedStore: string | null;
  selectStore: (id: string) => void;
};

const initialState: SessionProviderState = {
  status: SessionStatus.UNAUTHENTICATED,
  signIn: () => {},
  signOut: () => {},
  selectedStore: null,
  selectStore: () => {},
};

const SessionProviderContext = createContext<SessionProviderState>(initialState);

interface SearchProviderProps {
  children: React.ReactNode;
}

const SIGNED_IN = gql`
  query SignedIn {
    me {
      id
    }
  }
`;

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
  query SelectStore($id: ID!) {
    store(where: { id: $id }) {
      id
    }
  }
`;

function SessionProvider({ children, ...props }: SearchProviderProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.UNAUTHENTICATED);
  const [selectedStore, setSelectedStore] = useState<string | null>(localStorage.getItem("selectedStore") || null);

  useEffect(() => {
    apolloClient.query({ query: SIGNED_IN }).then(() => {
      setStatus(SessionStatus.AUTHENTICATED);
    });
  }, []);

  const [signIn] = useMutation(SIGN_IN, {
    onCompleted: (data) => {
      localStorage.setItem("accessToken", data.generateToken.accessToken);
      localStorage.setItem("refreshToken", data.generateToken.refreshToken);

      toast({ title: "Signed in", description: "You have successfully signed in." });
      setStatus(SessionStatus.AUTHENTICATED);
    },
    onError: (error) => {
      toast({ title: "Could not sign in", description: error.message, variant: "destructive" });
      setStatus(SessionStatus.UNAUTHENTICATED);
    },
  });

  const [signOut] = useMutation(SIGN_OUT);

  const [selectStore] = useLazyQuery(SELECT_STORE, {
    onCompleted: (data) => {
      localStorage.setItem("selectedStore", data.store.id);
      setSelectedStore(data.store.id);
    },
    onError: () => {
      localStorage.removeItem("selectedStore");
      setSelectedStore(null);
    },
  });

  const value = {
    status,
    signIn: (email: string, password: string) => {
      setStatus(SessionStatus.LOADING);
      signIn({ variables: { email, password } });
    },
    signOut: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      apolloClient.clearStore();

      setStatus(SessionStatus.UNAUTHENTICATED);
      signOut();
    },
    selectedStore,
    selectStore: (id: string) => selectStore({ variables: { id }}),
  };

  return (
    <SessionProviderContext.Provider {...props} value={value}>
      {children}
    </SessionProviderContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionProviderContext);

  if (context === undefined) throw new Error("useSession must be used within a SessionProvider");

  return context;
};

export default SessionProvider;
