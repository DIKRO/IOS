import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function Layout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShadowVisible: false }}>
        <Stack.Screen name="index" options={{ title: "Money UX" }} />
        <Stack.Screen name="categories" options={{ title: "Категории" }} />
        <Stack.Screen name="settings" options={{ title: "Настройки" }} />
      </Stack>
    </>
  );
}
