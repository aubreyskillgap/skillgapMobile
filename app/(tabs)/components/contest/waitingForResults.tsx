import { useTheme } from "@/hooks/useThemeContext";
import { Router } from "@/services/router";
import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const WaitingForResult = () => {
  const { theme } = useTheme();
  useEffect(()=>{
    Router.clearHistory();
  })
  return (
    <View
      style={{
        backgroundColor: theme ? "#1a1a1a" : "#ffffff",
        padding: 24,
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
      }}
    >
      {/* Thematic Icon */}
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Image
          source={
            theme
              ? require("../../../../assets/icons/confirmDark.png")
              : require("../../../../assets/icons/confirmLight.png")
          }
          style={{ width: 80, height: 80, resizeMode: "contain" }}
        />
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: theme ? "#ffffff" : "#000000",
          marginBottom: 8,
        }}
      >
       Thank you
      </Text>

      {/* Description */}
      <Text
        style={{
          fontSize: 14,
          color: theme ? "#cccccc" : "#888888",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        We’ve recorded your response and will inform you once a final decision is reached.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#1D9BF0",
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 50,
        }}
        onPress={() => {
          Router.push("/mainApp")
        }}
      >
        <Text style={{ color: "white", fontWeight: "600", fontSize: 14 }}>
          My Contests
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WaitingForResult;
