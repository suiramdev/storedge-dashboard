import { gql, useMutation } from "@apollo/client";
import { createContext, useContext, useState } from "react";
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
};

const initialState: SessionProviderState = {
  status: SessionStatus.UNAUTHENTICATED,
  signIn: () => {},
  signOut: () => {},
};

const SessionProviderContext = createContext<SessionProviderState>(initialState);

interface SearchProviderProps {
  children: React.ReactNode;
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

function SessionProvider({ children, ...props }: SearchProviderProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.UNAUTHENTICATED);

  const [signIn] = useMutation(SIGN_IN, {
    onCompleted: (data) => {
      localStorage.setItem("accessToken", data.generateToken.accessToken);
      localStorage.setItem("refreshToken", data.generateToken.refreshToken);

      toast({ title: "Signed in", description: "You have successfully signed in." });
      setStatus(SessionStatus.AUTHENTICATED);
    },
    onError: (error) => {
      toast({ title: "Could not sign in", description: error.message });
      setStatus(SessionStatus.UNAUTHENTICATED);
    },
  });

  const [signOut] = useMutation(SIGN_OUT, {
    onCompleted: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      apolloClient.clearStore();

      toast({ title: "Signed out", description: "You have successfully signed out." });
      setStatus(SessionStatus.UNAUTHENTICATED);
    },
    onError: (error) => {
      toast({ title: "Could not sign out", description: error.message });
    },
  });

  const value = {
    status,
    signIn: (email: string, password: string) => {
      setStatus(SessionStatus.LOADING);
      signIn({ variables: { email, password } });
    },
    signOut,
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
