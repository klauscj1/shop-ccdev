import { createContext } from "react";

interface ContextProps {
  isMenuOpen: boolean;
  toggleOpenMenu: () => void;
}

export const UiContext = createContext<ContextProps>({} as ContextProps);
