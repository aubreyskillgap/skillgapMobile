import Input from "@/components/ui/Input";
import { useTheme } from "@/hooks/useThemeContext";
import { useDebounce } from "@/services/formValidation";
import { Logger } from "@/services/logger";
import { IOtherUserRecord, User } from "@/services/user";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface IBlockUser {
  userBlocked: (value: any) => void;
}

const BlockUser = ({ userBlocked }: IBlockUser) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [skillTag, setSkillTag] = useState("");
  const [error, setError] = useState(false);
  const [otherUserRecord, setOtherUserRecord] =
    useState<IOtherUserRecord | null>();

  const handleConfirm = () => {
    setIsLoading(true);
    User.blockUser(otherUserRecord?.id ?? 0).then(async (response) => {
      setIsLoading(false);
      Logger.error(response);
      userBlocked(response);
    });
  };

  const debouncedSearch = useCallback(
    useDebounce(() => {
      User.getUserByTag(skillTag).then((response) => {
        setError(response === null ? true : false);
        setOtherUserRecord(response);
      });
    }, 1000),
    [skillTag]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      debouncedSearch();
    }, 1000);
    return () => clearTimeout(handler);
  }, [skillTag]);

  const BlockUserStyles = StyleSheet.create({
    container: {
      padding: 20,
      flex: 1,
    },
    title: {
      color: theme == false ? "#020B12" : "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    description: {
      color: theme === false ? "#333333" : "#fff",
      fontSize: 14,
      marginBottom: 15,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#444",
      borderRadius: 100,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    input: {
      flex: 1,
      color: "#FFF",
      fontSize: 16,
    },
    icon: {
      marginLeft: 10,
    },
    inputError: {
      borderColor: "#FF4444",
    },
    errorText: {
      color: "#FF4444",
      fontSize: 10,
      marginTop: 5,
    },
    confirmButton: {
      backgroundColor: skillTag == "" || error ? "#8F8F8F" : "#1E90FF",
      paddingVertical: 15,
      borderRadius: 30,
      alignItems: "center",
      marginTop: 20,
    },
    confirmText: {
      color: "#FFF",
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  return (
    <View style={BlockUserStyles.container}>
      <Text style={BlockUserStyles.title}>Block a user</Text>
      <Text style={BlockUserStyles.description}>
        If you block this user you would not be able to see and partake in any
        contest hosted by them
      </Text>

      <Input
        type="text"
        placeholder="Enter Skillgap tag"
        value={(e) => setSkillTag(e)}
      />

      {error ? (
        <Text style={BlockUserStyles.errorText}>
          This Skill gap tag was incorrect or does not exist on our database
        </Text>
      ) : null}
      <TouchableOpacity
        //disabled={skillTag == "" || error ? true : false}
        style={BlockUserStyles.confirmButton}
        onPress={handleConfirm}
      >
        <Text style={BlockUserStyles.confirmText}>
          {isLoading ? (
            <ActivityIndicator size={30} color={"#ffffff"} />
          ) : (
            "Confirm"
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BlockUser;
