import PageContainer from "@/components/Containers";
import { useUserContext } from "@/hooks/useAppContext";
import { useTheme } from "@/hooks/useThemeContext";
import { Media } from "@/services/media";
import { NotificationType } from "@/services/notification";
// import {
//   askNotificationPermission,
//   ensureAndroidChannel,
//   getExpoPushTokenOrThrow,
// } from "@/services/notificationPermission";
import { Router } from "@/services/router";
import { SessionUser, User } from "@/services/user";
import { useFocusEffect } from "@react-navigation/native";
import { getExpoPushTokenAsync } from "expo-notifications";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PlusIcon } from "react-native-heroicons/outline";
import FloatingWallet from "../components/floatingWallet";
import NetworkImage from "../components/networkImage";
import ShowContest from "../components/showContest";
import TrendingCategory from "../components/trendingCategories";
import SplashScreen from "../splashScreen";

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null);
  const [testRoute, setTestRoute] = useState<any>("");
  const [type, setType] = useState<NotificationType | null>(null);

  // async function setRandomTypeAndNotify() {
  //   // 1) Pick random type
  //   const values = Object.values(NotificationType);
  //   const randomValue = values[
  //     Math.floor(Math.random() * values.length)
  //   ] as NotificationType;

  //   // 2) Update state
  //   setType(randomValue);

  //   // 3) Trigger push with the new type
  //   if (!token) return;
  //   try {
  //     const res = await fetch("https://exp.host/--/api/v2/push/send", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         "Accept-encoding": "gzip, deflate",
  //       },
  //       body: JSON.stringify({
  //         to: token,
  //         title: "Hello 👋",
  //         body: `New type chosen: ${randomValue}`, // make it visible in tray
  //         sound: "default",
  //         data: { type: randomValue },
  //       }),
  //     });

  //     const json = await res.json();
  //     console.log("Push ticket:", json);
  //   } catch (err) {
  //     console.error("Push send failed:", err);
  //   }
  // }
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       await ensureAndroidChannel(); // 1) channel first
  //       const status = await askNotificationPermission(); // 2) then request permission
  //       if (status !== "granted") {
  //         Alert.alert(
  //           "Permission required",
  //           "Enable notifications in Settings."
  //         );
  //         return;
  //       }
  //       const t = await getExpoPushTokenOrThrow(); // 3) then fetch token
  //       setToken(t);
  //     } catch (e: any) {
  //       console.error(e);
  //       Alert.alert("Push setup error", e?.message ?? String(e));
  //     }
  //   })();

  //   const subRecv = Notifications.addNotificationReceivedListener((n) => {
  //     console.log("foreground notification:", n);
  //   });
  //   const subResp = Notifications.addNotificationResponseReceivedListener(
  //     (r) => {
  //       const data = r.notification.request.content.data;
  //       switch (data?.type) {
  //         case "request":
  //           Router.push("/(tabs)/components/contest/myContestDetails");
  //           break;

  //         case "won":
  //           Router.push("/(tabs)/components/contest/myContestDetails");
  //           break;

  //         case "lost":
  //           Router.push("/(tabs)/components/contest/myContestDetails");
  //           break;

  //         case "dispute":
  //           Router.push("/(tabs)/components/contest/myContestDetails");
  //           break;

  //         case "deposit":
  //           Router.push("/mainApp/wallet");
  //           break;

  //         case "withdraw":
  //           Router.push("/mainApp/wallet");
  //           break;

  //         default:
  //           Router.push("/mainApp/home");
  //           break;
  //       }
  //     }
  //   );
  //   return () => {
  //     subRecv.remove();
  //     subResp.remove();
  //   };
  // }, []);

  const [refreshToken, setRefreshToken] = useState(false);
  const { theme, setTheme } = useTheme();
  const { setUser, user } = useUserContext();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    User.Load();
    setRefreshToken(!refreshToken);
    setUser(SessionUser);
    setTheme(SessionUser?.preferences.darkMode ?? false);
  };

  useFocusEffect(
    useCallback(() => {
      console.log(getExpoPushTokenAsync());
      console.log(getExpoPushTokenAsync());
      Router.clearHistory();
      User.Load(() => {
        setUser(SessionUser);
        setTheme(SessionUser?.preferences.darkMode ?? false);
      });
    }, [])
  );

  return !user ? (
    <SplashScreen />
  ) : (
    <PageContainer backgroundColor={theme == false ? "#FAFAFA" : "#0A0A0A"}>
      <ScrollView>
        <View
          style={{
            width: "100%",
            padding: 16, // p-4 → 4 * 4
            flexDirection: "column",
            backgroundColor: theme == false ? "#FAFAFA" : "#131315",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginBottom: 20, // mb-5 → 5 * 4
              alignItems: "center",
            }}
          >
            <View
              style={{
                borderStyle: "solid",
                borderColor: "red",
                width: "auto",
                borderRadius: 100,
                marginRight: 10,
                position: "relative",
              }}
            >
              <NetworkImage
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                }}
                uri={Media.GetProfileImageUris(SessionUser?.id ?? 0)?.medium}
                loadingUri={require("../../../assets/images/profile-img.png")}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  color: "#8F8F8F",
                  marginRight: 4,
                }}
              >
                Howdy,
              </Text>
              {/* <Button title={testRoute} /> */}
              <Text
                style={{
                  fontWeight: "600",
                  color: theme == false ? "#000000" : "#ffffff",
                  textTransform: "capitalize",
                }}
              >
                {user?.fullName}
              </Text>
            </View>
          </View>

          <FloatingWallet refreshing={refreshToken} />
          <TrendingCategory refreshing={refreshToken} />
          <ShowContest refreshing={refreshToken} />
        </View>
      </ScrollView>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() =>
            Router.push("/(tabs)/components/contest/createContest")
          }
        >
          <PlusIcon size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    backgroundColor: "#1D9BF0",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export const Nodata = () => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontWeight: "600",
          fontSize: 16,
          marginBottom: 1,
          color: theme ? "#fff" : "#000",
        }}
      >
        Ouch!
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#8F8F8F",
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        You don’t have an active contest now
      </Text>

      <View style={{ flexDirection: "row", marginTop: 4 }}>
        <TouchableOpacity
          onPress={() => Router.push("(tabs)/components/contest/createContest")}
        >
          <Text style={{ color: "#1D9BF0", fontSize: 14 }}>Create</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 14, color: "#777", fontWeight: 500 }}>
          {" "}
          or{" "}
        </Text>

        <TouchableOpacity onPress={() => Router.push("/mainApp/arena")}>
          <Text style={{ color: "#1D9BF0", fontSize: 14, fontWeight: 500 }}>
            Join contest
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 14, color: "#777", fontWeight: 500 }}>
          {" "}
          now
        </Text>
      </View>
    </View>
  );
};
