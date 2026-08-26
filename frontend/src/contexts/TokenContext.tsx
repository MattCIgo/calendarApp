import { createContext, useContext, useState, useEffect } from "react";

interface TokenContextType {
  accessToken: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}

const TokenContext = createContext<TokenContextType | null>(null)

//TODO: get date token should be here too?
export const TokenProvider:React.FC<{children: React.ReactNode}> = ({children}) => {
  const [accessToken, setAccessToken] = useState<string | null>('');

  
  const login = (newToken: string) => {
    setAccessToken(newToken);
  };

  const logout = () => {
    setAccessToken(null);
  };

  return (
    <TokenContext.Provider value={{accessToken, login, logout}}>
      {children}
    </TokenContext.Provider>
  );
}

export const useToken = () => {
  const context = useContext(TokenContext);

  if (!context) {
    throw new Error("accessToken must be used within a TokenProvider");
  }

  return context;
};