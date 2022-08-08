import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, ReactElement, useReducer, useEffect } from "react";
import { tesloApi } from "../../api";
import { IUser } from "../../interfaces";
import { AuthContext, authReducer } from "./";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
  error: string;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  error: "",
};

interface Props {
  children: ReactElement | ReactElement[];
}

type ServerError = { message: string };

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      dispatch({ type: "[Auth]-Login", payload: data?.user as IUser });
    }
  }, [status, data]);

  // useEffect(() => {
  //   checkToken();
  // }, []);

  const checkToken = async () => {
    if (!Cookies.get("token")) {
      return;
    }
    try {
      const { data } = await tesloApi.get("/user/validate-token");
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[Auth]-Login", payload: user });
    } catch (error) {
      Cookies.remove("token");
    }
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: "[Auth]-Set error", payload: "" });
      const { data } = await tesloApi.post("/user/login", { email, password });

      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[Auth]-Login", payload: user });
      return true;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errx = error as AxiosError<ServerError>;
        const message = errx.response?.data?.message as string;
        dispatch({ type: "[Auth]-Set error", payload: message });
      } else {
        dispatch({ type: "[Auth]-Set error", payload: "Ocurrio un error contacte al administrador" });
      }
      return false;
    }
  };

  const registerUser = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      dispatch({ type: "[Auth]-Set error", payload: "" });
      const { data } = await tesloApi.post("/user/register", { email, password, name });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[Auth]-Login", payload: user });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errx = error as AxiosError<ServerError>;
        const message = errx.response?.data?.message as string;
        dispatch({ type: "[Auth]-Set error", payload: message });
      } else {
        dispatch({ type: "[Auth]-Set error", payload: "Ocurrio un error contacte al administrador" });
      }

      return false;
    }
  };

  const logout = () => {
    // Cookies.remove("token");
    Cookies.remove("cart");
    Cookies.remove("lastName");
    Cookies.remove("firstName");
    Cookies.remove("address");
    Cookies.remove("address2");
    Cookies.remove("zip");
    Cookies.remove("city");
    Cookies.remove("country");
    Cookies.remove("phone");
    signOut();
    //router.reload();
    // dispatch({ type: "[Auth]-Logout" });
  };

  return (
    <AuthContext.Provider value={{ ...state, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
