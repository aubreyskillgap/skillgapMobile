import PageContainer from "@/components/Containers";
import { useUserContext } from "@/hooks/useAppContext";
import { useTheme } from "@/hooks/useThemeContext";
import { Media } from "@/services/media";
import { Router } from "@/services/router";
import { SessionUser, User } from "@/services/user";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import NetworkImage from "../components/networkImage";
import Settings from "../components/settings";
import UserDetails from "../components/userDetails";
import Utilities from "../components/utilities";

const Profile = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3"]);

  const { theme, setTheme } = useTheme();
  const { user, setUser } = useUserContext();
  const onRefresh = () => {
    User.Load();
    setUser(SessionUser);
    setTheme(SessionUser?.preferences.darkMode ?? false);
  };

  useEffect(() => {
    Router.clearHistory();
    User.Load();
    setUser(SessionUser);
    setTheme(SessionUser?.preferences.darkMode ?? false);
  }, []);

  return (
    <PageContainer backgroundColor={theme == false ? "" : "#141414"}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ImageBackground
          defaultSource={require("../../../assets/images/profile-bg.png")}
          source={{
            uri: Media.GetCoverImageUris(SessionUser?.id ?? 0).original,
          }}
          style={{
            height: 140,
            width: "100%",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 80,
              left: "50%",
              transform: [{ translateX: -60 }],
              zIndex: 10,
            }}
          >
            <NetworkImage
              loadingUri={require("../../../assets/images/profile-img.png")}
              uri={Media.GetProfileImageUris(SessionUser?.id ?? 0).original}
              style={{
                height: 120,
                width: 120,
                borderRadius: 60,
                borderWidth: 2,
                borderColor: "white",
              }}
            />
          </View>
        </ImageBackground>

        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 24,
            marginTop: 16,
            zIndex: -10,
          }}
        >
          <UserDetails />

          <Utilities />

          <Settings />
        </View>
      </ScrollView>
    </PageContainer>
  );
};

export default Profile;
