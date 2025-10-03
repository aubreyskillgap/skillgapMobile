import { useTheme } from "@/hooks/useThemeContext";
import { IOtherUserRecord } from "@/services/user";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WarningModal from "./modals";

const BlockedList = () => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [blockedList, setBlockList] = useState<IOtherUserRecord[]>([]);

  const BlockedStyles = StyleSheet.create({
    itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme === false ? "#FFFFFF" : "#121212",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme === false ? "#F7F7F7" : "#27292B",
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    statusDot: {
      width: 10,
      height: 10,
      backgroundColor: "#00FF00",
      borderRadius: 5,
      position: "absolute",
      bottom: 5,
      left: 40,
    },
    username: {
      color: theme === false ? "#020B12" : "#FFF",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 10,
    },
    dateBlocked: {
      color: "#AAA",
      fontSize: 9,
      marginLeft: 10,
    },
    unblockButton: {
      backgroundColor: "#1D9BF0",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 5,
    },
    unblockText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "bold",
    },
  });

  useEffect(() => {}, []);

  return (
    <View>
      <View style={{ paddingTop: 30, paddingLeft: 20, paddingBottom: 10 }}>
        <Text
          style={
            theme === false
              ? { color: "#020B12", fontWeight: "bold", fontSize: 16 }
              : { color: "#FFF", fontWeight: "bold", fontSize: 16 }
          }
        >
          Blocked Users
        </Text>
      </View>
      <View>
        <ScrollView>
          {blockedList.map((item: IOtherUserRecord) => (
            <View style={BlockedStyles.itemContainer} key={item.id}>
              <View style={BlockedStyles.userInfo}>
                <Image
                  source={
                    // item.imageUri
                    //   ? { uri: item.imageUri }
                    //   :
                    require("../../../assets/images/profile-img.png")
                  }
                  style={BlockedStyles.avatar}
                />
                <View style={BlockedStyles.statusDot} />
                <View>
                  <Text style={BlockedStyles.username}>@{item.tag}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={BlockedStyles.unblockButton}
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <Text style={BlockedStyles.unblockText}>unblock</Text>
              </TouchableOpacity>
              {modalVisible ? (
                <WarningModal
                  text=" Are you sure you want to unblock this Skillgap account?"
                  cancel={() => {
                    setModalVisible(false);
                  }}
                  proceed={() => {}}
                />
              ) : null}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default BlockedList;
