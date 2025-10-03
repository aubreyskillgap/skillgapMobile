import { useTheme } from "@/hooks/useThemeContext";
import { Router } from "@/services/router";
import { useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
const StyledText = styled(Text);
const StyledTouchable = styled(TouchableOpacity);

const LostCard = () => {
  const { theme } = useTheme();
  const { opponentTagName, stake } = useLocalSearchParams();
  useEffect(() => {
    Router.clearHistory();
  });
  const ModalStyles = StyleSheet.create({
    modalContent: {
      backgroundColor: theme == false ? "#ffffff" : "#1A1A1A",
      padding: 20,
      alignItems: "center",
      height: "100%",
      justifyContent: "center",
    },
    warningIcon: {
      width: 80,
      height: 80,
      marginBottom: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme == false ? "#000000" : "#FFF",
    },
    modalText: {
      color: "#AAA",
      fontSize: 14,
      textAlign: "center",
      marginVertical: 10,
    },
    buttonRow: {
      flexDirection: "row",
      marginTop: 20,
      gap: 20,
    },
    yesButton: {
      borderColor: "#D42620",
      borderWidth: 2,
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 100,
      marginRight: 10,
      width: 100,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    yesText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "bold",
    },
    noButton: {
      backgroundColor: "#D42620",
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 100,
      width: 100,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    noText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <View style={ModalStyles.modalContent}>
      <TouchableOpacity
        style={{ width: "100%", display: "flex", alignItems: "flex-end" }}
        onPress={() => {
          close();
        }}
      >
        <XMarkIcon />
      </TouchableOpacity>
      <Image
        source={
          theme == false
            ? require("../../../../assets/images/cloudW.png")
            : require("../../../../assets/images/cloud.png")
        }
        style={ModalStyles.warningIcon}
      />
      <StyledTouchable
        onPress={() => {
          close();
        }}
        className="absolute top-4 right-4"
      >
        <StyledText className="text-white text-2xl">×</StyledText>
      </StyledTouchable>
      <Text style={ModalStyles.modalTitle}>Ouch!</Text>
      <Text style={ModalStyles.modalText}>
        You lost &#8358;{stake} to {opponentTagName}
      </Text>
      <View>
        <TouchableOpacity
          style={{
            width: wp("70%"),
            backgroundColor: "#1D9BF0",
            margin: "auto",
            alignItems: "center",
            paddingVertical: 15,
            borderRadius: 100,
          }}
          onPress={() => Router.push("/mainApp")}
        >
          <Text style={ModalStyles.yesText}>My contests</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LostCard;
