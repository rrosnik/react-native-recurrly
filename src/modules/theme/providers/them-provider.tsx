import { createContext, useContext, useLayoutEffect } from "react";
import { Appearance } from "react-native";


const ThemeContext = createContext({
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {

    useLayoutEffect(() => {
        Appearance.setColorScheme("light");
    }, []);

    return (
        <ThemeContext.Provider value={{}}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);