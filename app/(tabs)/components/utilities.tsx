import { useUserContext } from "@/hooks/useAppContext";
import { useTheme } from "@/hooks/useThemeContext";
import { SessionUser, User } from "@/services/user";
import { useState } from "react";
import { Switch, Text, View } from "react-native";

const Utilities = () => {
  const {theme,setTheme} = useTheme();
  const {user,setUser} = useUserContext()
  const [isOpenToContest, setIsOpenToContest] = useState(
    SessionUser?.preferences.openToContest ?? true
  );
  const [isDarkMode, setIsDarkMode] = useState(
    user?.preferences.darkMode ?? true
  );
  return (
    <View
      style={{
        borderWidth: 1,
        paddingHorizontal: 8, // px-2
        paddingVertical: 16, // py-4
        borderRadius: 10, // rounded-2xl
        marginBottom: 12, // mb-3
        backgroundColor: theme == false ? "#FFFFFF" : "#1D1F20",
        borderColor: theme == false ? "#E7F4FD" : "#27292B",
      }}
    >
      {/* First setting block */}
      <View
        style={{
          paddingHorizontal: 8, // px-2
          paddingVertical: 12, // py-3
          borderBottomWidth: 1,
          borderColor: theme == false ? "#F7F7F7" : "#27292B",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: theme == false ? "#000" : "#FFFFFF",
            }}
          >
            Open to contest
          </Text>
          <Switch
            value={isOpenToContest}
            onValueChange={() => {
              const newContest = !isOpenToContest;
              setIsOpenToContest(newContest);
              User.updatePreferences(newContest, isDarkMode);
            }}
            style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
          />
        </View>
        <Text
          style={{
            fontSize: 11,
            color: theme == false ? "#333333" : "#8F8F8F",
          }}
        >
          This will enable other users know when you are available to take a
          challenge
        </Text>
      </View>

      {/* Second setting block */}
      <View
        style={{
          paddingHorizontal: 8, // px-2
          paddingVertical: 12, // py-3
          borderBottomWidth: 1,
          borderColor: theme == false ? "#F7F7F7" : "#27292B",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: theme == false ? "#000" : "#FFFFFF",
            }}
          >
            Light or Dark Mode
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={() => {
              const newMode = !isDarkMode;
              setIsDarkMode(newMode);
              setTheme(newMode)
              User.updatePreferences(isOpenToContest, newMode);
            }}
            style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
          />
        </View>
        <Text
          style={{
            fontSize: 10,
            color: theme == false ? "#333333" : "#8F8F8F",
          }}
        >
          Be your own lead, switch any mode that matches your interest.
        </Text>
      </View>
    </View>
  );
};

export default Utilities;
