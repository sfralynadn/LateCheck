import { createContext, ReactNode, useMemo } from "react";
import { Auth } from "../types/auth";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api/api";

interface iContext {
  auth: Auth;
  authLoading: boolean;
}

const AuthContext = createContext<iContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const response = await api.get("/auth/me");
        if (response.status == 200) return response.data.data;
        else return null;
      } catch {
        return null;
      }
    },
  });

  const { data: auth, isLoading: authLoading } = useMemo(() => {
    return {
      data,
      isLoading,
    };
  }, [data, isLoading]);

  return (
    <AuthContext.Provider value={{ auth, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
