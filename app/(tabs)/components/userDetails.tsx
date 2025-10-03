import { useUserContext } from "@/hooks/useAppContext";
import { useTheme } from "@/hooks/useThemeContext";
import { Logger } from "@/services/logger";
import { SessionUser } from "@/services/user";
import React from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import CountryPicker from "react-native-country-picker-modal";

const socials = [
  {
    id: "3",
    icon: require("../../../assets/icons/instagram.png"),
    url: "https://www.instagram.com",
  },
  {
    id: "2",
    icon: require("../../../assets/icons/twitter.png"),
    url: "https://www.twitter.com",
  },
  {
    id: "4",
    icon: require("../../../assets/icons/tiktok.png"),
    url: "https://www.tiktok.com",
  },
  {
    id: "1",
    icon: require("../../../assets/icons/youtube.png"),
    url: "https://www.youtube.com",
  },
];

const UserDetails = () => {
  const { theme } = useTheme();
  const { user } = useUserContext();
  const openSocialLink = (social: any) => {
    let link = "";

    Logger.info(link);
    switch (social.id) {
      case "1":
        link = SessionUser?.socials?.youtube ?? "";
        break;
      case "2":
        link = SessionUser?.socials?.twitter ?? "";
        break;
      case "3":
        link = SessionUser?.socials.instagram ?? "";
        break;
      case "4":
        link = SessionUser?.socials.tikTok ?? "";
        break;
    }

    link = link.toLowerCase();

    link &&
      Linking.canOpenURL(link).then((supported) => {
        if (supported) {
          Linking.openURL(link);
        } else {
          Logger.error("Failed to open link:", link);
        }
      });
  };

  const hasSocialLink = (social: any) => {
    let link = "";

    switch (social.id) {
      case "1":
        link = SessionUser?.socials?.youtube ?? "";
        break;
      case "2":
        link = SessionUser?.socials?.twitter ?? "";
        break;
      case "3":
        link = SessionUser?.socials.instagram ?? "";
        break;
      case "4":
        link = SessionUser?.socials.tikTok ?? "";
        break;
    }

    return link.length > 0;
  };

  return (
    <View
      style={{
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 16,
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: theme == false ? "#FFFFFF" : "#1D1F20",
        borderColor: theme == false ? "#E7F4FD" : "#27292B",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginBottom: 4,
          position: "relative",
        }}
      >
        <CountryPicker withFlag countryCode="NG" />

        <View
          style={{
            position: "absolute",
            width: 50,
            height: 30,
            zIndex: 100,
          }}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text
          style={{
            fontWeight: "600",
            textAlign: "center",
            textTransform: "capitalize",
            color: theme == false ? "#000" : "#fff",
          }}
        >
          {user?.fullName}
        </Text>
        <Text
          style={{
            fontSize: 12,
            textAlign: "center",
            color: theme == false ? "#000" : "#fff",
          }}
        >
          @{user?.tag}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginVertical: 12,
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            rowGap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "500",
              color: theme == false ? "#020B12" : "#fff",
            }}
          >
            No. of dispute
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: theme == false ? "#000" : "#fff",
            }}
          >
            {user?.stats.disputes}
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            rowGap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "500",
              color: theme == false ? "#020B12" : "#fff",
            }}
          >
            No. of Contest
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: theme == false ? "#000" : "#fff",
            }}
          >
            {user?.stats.contests}
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            rowGap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "500",
              color: theme == false ? "#020B12" : "#fff",
            }}
          >
            No. of Wins
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: theme == false ? "#000" : "#fff",
            }}
          >
            {user?.stats.wins}
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            rowGap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "500",
              color: theme == false ? "#020B12" : "#fff",
            }}
          >
            No of losses
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: theme == false ? "#000" : "#fff",
            }}
          >
            {user?.stats.losses}
          </Text>
        </View>
      </View>

      <View
        style={{
          borderRadius: 10,
          padding: 16,
          borderWidth: 1,
          borderColor: theme == false ? "#E7F4FD" : "#313335",
          backgroundColor: theme == false ? "#FAFAFA" : "#27292B",
        }}
      >
        <Text
          style={{
            marginBottom: 8,
            fontWeight: "500",
            textAlign: "center",
            color: theme == false ? "#000" : "#fff",
          }}
        >
          Bio
        </Text>
        <Text
          style={{
            color: "#8F8F8F",
            fontSize: 12,
            textAlign: "center",
            lineHeight: 15,
          }}
        >
          {user?.bio ?? "- - - "}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 12,
        }}
      >
        {socials
          .filter((item) => hasSocialLink(item))
          .map((item, index) => (
            <TouchableOpacity key={index} onPress={() => openSocialLink(item)}>
              <Image
                source={item.icon}
                style={{ width: 20, height: 15, marginHorizontal: 3 }}
              />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

export default UserDetails;
