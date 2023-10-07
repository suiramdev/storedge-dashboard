import { createContext, useContext, useState } from "react";

type SessionProviderState = {
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
};

const initialState: SessionProviderState = {
  authenticated: false,
  setAuthenticated: () => null,
};

const SessionProviderContext = createContext<SessionProviderState>(initialState);

interface SearchProviderProps {
  children: React.ReactNode;
}

function SessionProvider({ children, ...props }: SearchProviderProps) {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const value = {
    authenticated,
    setAuthenticated,
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
