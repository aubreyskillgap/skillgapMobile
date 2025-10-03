import { Stack } from "expo-router";
import "react-native-reanimated";

import { SessionUser } from "@/services/user";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import CustomToast from "./(tabs)/components/customToast";
import SplashScreen from "./(tabs)/splashScreen";

export default function RootLayout() {
  const [one, setOne] = useState<number>(4);
  const [appKey, setAppKey] = useState(0);
  const [refreshApp, setRefreshApp] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setOne(0);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (refreshApp) {
      setAppKey((prev) => prev + 1); // forces remount
    }
  }, [SessionUser]);

  if (one != 0) {
    return <SplashScreen />;
  }
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast
        config={{
          custom: (props) => <CustomToast {...props} />,
        }}
      />
    </>
  );
}
