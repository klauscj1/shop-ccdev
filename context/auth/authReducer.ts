import { IUser } from "../../interfaces";
import { AuthState } from "./AuthProvider";

type AuthActionType =
  | {
      type: "[Auth]-Login";
      payload: IUser;
    }
  | {
      type: "[Auth]-Logout";
    }
  | {
      type: "[Auth]-Set error";
      payload: string;
    };

export const authReducer = (state: AuthState, action: AuthActionType): AuthState => {
  switch (action.type) {
    case "[Auth]-Login":
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };
    case "[Auth]-Logout":
      return {
        ...state,
        isLoggedIn: false,
        user: undefined,
      };
    case "[Auth]-Set error":
      return {
        ...state,
        isLoggedIn: false,
        user: undefined,
        error: action.payload,
      };
    default:
      return state;
  }
};
