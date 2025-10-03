import PageContainer from "@/components/Containers";
//import { useDebounce } from "@/services/helpers/formValidation";

import { useTheme } from "@/hooks/useThemeContext";
import { Router } from "@/services/router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import BlockedList from "./blockedList";
import BlockUser from "./blockUser";
import { ConfirmModal } from "./modals";

const Personalized = () => {
    const {theme} = useTheme();

  const [blockUser, setBlockUser] = useState(false);
  const [skillTag, setSkillTag] = useState("");
  const [isBlockProcessSuccessful, setIsBlockProcessSuccessful] =
    useState(false);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: theme == false ? "#EDEFF1" : "#1D1F20",
      borderRadius: 100,
      padding: 5,
      alignItems: "center",
      justifyContent: "space-between",
      width: "90%",
      alignSelf: "center",
      marginBottom: 5,
    },
    blockButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 100,
      alignItems: "center",
      backgroundColor: blockUser
        ? "transparent"
        : theme == false
        ? "#FFFFFF"
        : "#141414",
    },
    viewBlockListButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 100,
      backgroundColor: blockUser
        ? theme == false
          ? "#FFFFFF"
          : "#141414"
        : "transparent",
      alignItems: "center",
    },
    text: {
      color: "#8F8F8F",
      fontSize: 16,
    },
  });

  return (
    <PageContainer backgroundColor={theme == false ? "" : "#141414"}>
      
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12, // mb-3 → 3 × 4
          }}
        >
          <View style={{ position: "absolute", top: 0, left: 12 }}>
            <TouchableOpacity
              onPress={() => {
                Router.back();
              }}
              style={{
                paddingLeft: 3,
                marginBottom: 24, // mb-6 → 6 × 4
                width: 30, // w-[30px]
                borderRadius: 9999,
              }}
            >
              <ChevronLeftIcon size={25} color={"#292D32"} />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 16, // text-base
              fontWeight: "600", // font-semibold
              color: theme == false ? "#020B12" : "#FFFFFF",
            }}
          >
            Personalized Settings
          </Text>
        </View>

        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => setBlockUser(false)}
            style={styles.blockButton}
          >
            <Text style={styles.text}>Block User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setBlockUser(true)}
            style={styles.viewBlockListButton}
          >
            <Text style={styles.text}>View Block List</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {blockUser ? (
          <BlockedList />
        ) : (
          <BlockUser userBlocked={(e) => setIsBlockProcessSuccessful(e)} />
        )}

        {isBlockProcessSuccessful ? (
          <ConfirmModal
            text={skillTag}
            proceed={() => {
              setIsBlockProcessSuccessful(false);
              setBlockUser(true);
            }}
            cancel={() => setIsBlockProcessSuccessful(false)}
          />
        ) : null}
      </ScrollView>
    </PageContainer>
  );
};

export default Personalized;
