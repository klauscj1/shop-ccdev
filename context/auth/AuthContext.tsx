import { createContext } from "react";
import { IUser } from "../../interfaces";

interface ContextProps {
  isLoggedIn: boolean;
  user?: IUser;
  error: string;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<ContextProps>({} as ContextProps);
