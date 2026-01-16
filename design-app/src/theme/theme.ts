import { useColorScheme } from "react-native";
import { ACCENT, dark, light } from "./colors";

export type Theme = typeof light & { accent: string };

export function useTheme(): Theme {
  const scheme = useColorScheme();
  const base = scheme === "dark" ? dark : light;
  return { ...base, accent: ACCENT };
}
