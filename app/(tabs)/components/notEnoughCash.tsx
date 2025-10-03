import { useTheme } from "@/hooks/useThemeContext";
import { Router } from "@/services/router";
import { styled } from "nativewind";
import React from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
const StyledText = styled(Text);
const StyledTouchable = styled(TouchableOpacity);

interface INotEnoughCash {
  close: () => void;
}
const NotEnoughCash = ({ close }: INotEnoughCash) => {
    const {theme} = useTheme();
  const ModalStyles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.7)",
    },
    modalContent: {
      backgroundColor: theme == false ? "#ffffff" : "#1A1A1A",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      width: "85%",
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
    <Modal animationType="fade" transparent={true}>
      <View style={ModalStyles.modalContainer}>
        <View style={ModalStyles.modalContent}>
          <TouchableOpacity style={{width:"100%",display:"flex",alignItems:"flex-end"}} onPress={()=>{close()}}>
            <XMarkIcon/>
          </TouchableOpacity>
          <Image
            source={
              theme == false
                ? require("../../../assets/images/cloudW.png")
                : require("../../../assets/images/cloud.png")
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
            You don’t have any money in your wallet to join this contest
          </Text>
          <View>
            <TouchableOpacity
              style={{
                width: wp("70%"),
                backgroundColor: "#1D9BF0",
                margin: "auto",
                alignItems: "center",
                paddingVertical: 10,
                borderRadius: 100,
              }}
              onPress={() => Router.push("/(tabs)/components/wallet/deposit")}
            >
              <Text style={ModalStyles.yesText}>Deposit Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NotEnoughCash;
