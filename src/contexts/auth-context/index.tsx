"use client";

import { UserDto } from "@definitions/dto";
import { createContext, useContext } from "react";

export interface AuthContextType {
  user: UserDto | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  authChecked: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  loading: false,
  error: null,
  authChecked: false,
});

const useAuthContext = () => useContext(AuthContext);

export default useAuthContext;
