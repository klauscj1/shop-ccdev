import { FC, ReactElement, useReducer } from "react";
import { UiContext, uiReducer } from "./";

export interface UiState {
  isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
  isMenuOpen: false,
};

interface Props {
  children: ReactElement | ReactElement[];
}

export const UiProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleOpenMenu = () => {
    dispatch({ type: "[UI]-Toggle Menu" });
  };
  return <UiContext.Provider value={{ ...state, toggleOpenMenu }}>{children}</UiContext.Provider>;
};
