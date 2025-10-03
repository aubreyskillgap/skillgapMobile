import { useTheme } from "@/hooks/useThemeContext";
import { SessionUser } from "@/services/user";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { widthPercentageToDP as wp } from "react-native-responsive-screen";

interface IWarningModal {
  proceed: () => void;
  cancel: () => void;
  text: string;
}
const WarningModal = ({ proceed, cancel, text }: IWarningModal) => {
  const { theme } = useTheme();
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
      color: "#FF4444",
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
          <Image
            source={require("../../../assets/icons/warning.png")}
            style={ModalStyles.warningIcon}
          />
          <Text style={ModalStyles.modalTitle}>Wait a minute!</Text>
          <Text style={ModalStyles.modalText}>{text}</Text>
          <View style={ModalStyles.buttonRow}>
            <TouchableOpacity
              style={ModalStyles.yesButton}
              onPress={() => {
                proceed();
              }}
            >
              <Text style={ModalStyles.yesText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ModalStyles.noButton}
              onPress={() => cancel()}
            >
              <Text style={ModalStyles.noText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const ConfirmModal = ({ proceed, cancel, text }: IWarningModal) => {
  const theme = SessionUser?.preferences.darkMode;
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
          <Image
            source={
              theme == false
                ? require("../../../assets/icons/confirmLight.png")
                : require("../../../assets/icons/confirmDark.png")
            }
            style={ModalStyles.warningIcon}
          />
          <Text style={ModalStyles.modalTitle}>It is a wrap</Text>
          <Text style={ModalStyles.modalText}>
            You have successfully blocked {text} you can go ahead and view all
            block users in your block list
          </Text>
          <View>
            <TouchableOpacity
              style={{
                width: wp("60%"),
                backgroundColor: "#1D9BF0",
                margin: "auto",
                alignItems: "center",
                paddingVertical: 10,
                borderRadius: 100,
              }}
              onPress={() => {
                proceed();
              }}
            >
              <Text style={ModalStyles.yesText}>View Block List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default WarningModal;
