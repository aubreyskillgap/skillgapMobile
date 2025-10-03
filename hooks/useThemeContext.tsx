import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from "react";

type themeContextType = {
  theme: boolean | null;
  setTheme: Dispatch<SetStateAction<boolean>>;
};

const ThemeContext = createContext<themeContextType | undefined>(undefined);

function useTheme(): themeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within an ThemeProvider");
  }
  return context;
}

const ThemeContextProvider = (props: { children: ReactNode }): ReactElement => {
  const [theme, setTheme] = useState<boolean>(false);
  return <ThemeContext.Provider {...props} value={{ theme, setTheme }} />;
};

export { ThemeContextProvider, useTheme };

