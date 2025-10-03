import { Media } from "@/services/media";
import { Router } from "@/services/router";
import { SessionUser } from "@/services/user";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import NetworkImage from "../networkImage";

const WinnerCard = () => {
  const { tagName, opponentTagName, stake } = useLocalSearchParams();
  useEffect(() => {
    Router.clearHistory();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#1D9BF0",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
      }}
    >
      <Image source={require("../../../../assets/icons/crown.png")} />
      <View
        style={{
          borderRadius: 4,
          padding: 20,
          alignItems: "center",
          width: 112,
          height: 112,
          borderWidth: 1,
          borderColor: "#D0D5DD",
        }}
      >
        {/* Profile Image */}
        <NetworkImage
          loadingUri={require("../../../../assets/images/profile-img.png")}
          uri={Media.GetProfileImageUris(SessionUser?.id ?? 0).original}
          style={{ width: 50, height: 50, borderRadius: 9999 }}
        />

        {/* Username */}
        <Text
          numberOfLines={1}
          style={{ color: "#fff", fontWeight: "500", fontSize: 12 }}
        >
          @{tagName}
        </Text>
      </View>

      {/* Congratulations Text */}
      <Text
        style={{
          color: "#fff",
          fontSize: 24,
          fontWeight: 600,
          marginTop: 24,
          textAlign: "center",
        }}
      >
        Congratulations
      </Text>
      <Text
        style={{
          color: "#fff",
          fontSize: 14,
          textAlign: "center",
          marginTop: 4,
        }}
      >
        You won &#8358;{stake} from ${opponentTagName}.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={{
          marginTop: 24,
          backgroundColor: "#fff",
          borderRadius: 24,
          width: 200,
          height: 52,
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => {
          Router.push("/mainApp/wallet");
        }}
      >
        <Text style={{ color: "#1E90FF", fontWeight: "500", fontSize: 14 }}>
          Check wallet
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WinnerCard;
