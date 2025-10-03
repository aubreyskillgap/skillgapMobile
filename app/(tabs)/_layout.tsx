import { Tabs } from "expo-router";
import React, { useEffect } from "react";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { AppContextProvider } from "@/hooks/useAppContext";
import { ThemeContextProvider } from "@/hooks/useThemeContext";
import { Router } from "@/services/router";
import { SessionUser } from "@/services/user";
import { BackHandler } from "react-native";
export default function TabLayout() {
  const colorScheme = SessionUser?.preferences.darkMode;
  useEffect(() => {
    const onBackPress = () => {
      Router.back();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => subscription.remove();
  }, []);


  return (
    <AppContextProvider>
      <ThemeContextProvider>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor:
                Colors[colorScheme ? "dark" : "light"].tint,
              headerShown: false,
              tabBarButton: HapticTab,
              tabBarBackground: TabBarBackground,
              tabBarStyle: {
                display: "none",
              },
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Home",
                tabBarIcon: ({ color }) => (
                  <IconSymbol size={28} name="house.fill" color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="explore"
              options={{
                title: "Explore",
                tabBarIcon: ({ color }) => (
                  <IconSymbol size={28} name="paperplane.fill" color={color} />
                ),
              }}
            />
          </Tabs>
      </ThemeContextProvider>
    </AppContextProvider>
  );
}
