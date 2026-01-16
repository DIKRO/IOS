import React from "react";
import { View, ViewStyle } from "react-native";
import { useTheme } from "../theme/theme";

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const t = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: t.card,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: t.border,
          padding: 14,
          shadowColor: t.shadow,
          shadowOpacity: 1,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 6,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
