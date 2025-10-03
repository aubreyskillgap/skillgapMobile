import { useUserContext } from "@/hooks/useAppContext";
import { useTheme } from "@/hooks/useThemeContext";
import { AuthSession } from "@/services/authSession";
import { Router } from "@/services/router";
import { User } from "@/services/user";
import { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const settingsOptions = [
  {
    id: "1",
    title: "Account Settings",
    icon: require("../../../assets/icons/account-settings-icon.png"),
    route: "/(tabs)/components/accountSettings",
    tags: ["Name", "Tag", "Photo", "Email", "Social media Tags"],
  },
  {
    id: "2",
    title: "Personalized Setting",
    icon: require("../../../assets/icons/personalized-settings-icon.png"),
    route: "/(tabs)/components/personalizedSettings",
    tags: ["Block user", "Arena beep"],
  },
];

const Settings = () => {
   const {theme} = useTheme();
   const {setUser} = useUserContext()
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleLogout = async () => {
    setModalVisible(false);
    setUser(null)
    User.clear()

    await AuthSession.logout();
  };

  return (
    <View>
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
        {settingsOptions.map((setting, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => Router.push(setting.route as string)}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 12,
              gap: 12,
              flexDirection: "row",
              borderBottomWidth: 1,
              borderColor: theme == false ? "#F7F7F7" : "#27292B",
            }}
          >
            <Image source={setting.icon} style={{ width: 20, height: 20 }} />

            <View>
              <Text
                style={{
                  marginBottom: 4,
                  fontSize: 12,
                  fontWeight: "500",
                  color: theme == false ? "#000" : "#FFFFFF",
                }}
              >
                {setting.title}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 4,
                  flexWrap: "wrap",
                }}
              >
                {setting.tags.map((tag, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: 10,
                      color: theme == false ? "#333333" : "#8F8F8F",
                    }}
                  >
                    {tag} .
                  </Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={{
          borderWidth: 1,
          paddingHorizontal: 8,
          paddingVertical: 16,
          borderRadius: 24,
          marginBottom: 12,
          borderColor: theme == false ? "#E7F4FD" : "#27292B",
          backgroundColor: theme == false ? "#FFFFFF" : "#1D1F20",
        }}
      >
        <View style={{ flexDirection: "row", paddingHorizontal: 8 }}>
          <Image
            source={require("../../../assets/icons/logout-icon.png")}
            style={{ width: 16, height: 16, marginRight: 8 }}
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: theme == false ? "#000" : "#FFFFFF",
            }}
          >
            Log Out
          </Text>
        </View>
      </TouchableOpacity>

      {/* Logout Modal */}
      {modalVisible ? (
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                source={require("../../../assets/icons/warning.png")}
                style={styles.warningIcon}
              />
              <Text style={styles.modalTitle}>Wait a minute!</Text>
              <Text style={styles.modalText}>
                Are you sure you want to logout your Skillgap account?
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.yesButton}
                  onPress={() => handleLogout()}
                >
                  <Text style={styles.yesText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.noButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.noText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}

    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
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
    color: "#FFF",
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
export default Settings;
