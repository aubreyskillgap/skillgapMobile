import { SessionUser } from "@/services/user";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";

const BackButton = () => {
  const theme = SessionUser?.preferences.darkMode;

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      className={`mb-6 w-[30px] rounded-full`}
      style={{
        paddingLeft: 3,
      }}
    >
      <ChevronLeftIcon
        size={25}
        color={!theme ? "#292D32" : "#ffffff"}
      />
    </TouchableOpacity>
  );
};

export default BackButton;
