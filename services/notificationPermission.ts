// import Constants from "expo-constants";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import { Platform } from "react-native";

// export async function ensureAndroidChannel() {
//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "Default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//     });
//   }
// }

// export async function askNotificationPermission() {
//   // Android 13+ and iOS require runtime permission
//   const { status: existing } = await Notifications.getPermissionsAsync();
//   if (existing === "granted") return "granted";
//   const { status } = await Notifications.requestPermissionsAsync();
//   console.log("notification", status);
//   return status;
// }

// export async function getExpoPushTokenOrThrow() {
//   if (!Device.isDevice) throw new Error("Use a physical device");

//   // Works in dev & EAS builds
//   const projectId =
//     (Constants?.expoConfig?.extra as any)?.eas?.projectId ??
//     (Constants as any)?.easConfig?.projectId;

//   if (!projectId) throw new Error("Missing EAS projectId in app.json");

//   const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
//   console.log("this is notification token", data);
//   return data;
// }

// // Present foreground notifications on Android
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//     shouldShowBanner: true,
//     shouldShowList: true,
//     shouldShowAlert: true,
//   }),
// });
