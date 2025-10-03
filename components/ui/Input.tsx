import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

interface IInput {
  type?: string;
  className?: string;
  icon?: string;
  placeholder: string;
  value?: (value: string) => void;
  text?: string;
}

const Input = ({ type, value, icon, placeholder,text }: IInput) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View
      style={{
        overflow: "hidden",
        borderWidth: 1,
        borderColor: isFocused ? "#338AF3" : "#D0D5DD",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderRadius: 24, // rounded-3xl ≈ 24px
        paddingHorizontal: 12, // px-3 ≈ 12px
        marginTop: 8, // mt-2 = 2 * 4 hb
        position: "relative",
        ...(isFocused && {
          borderWidth: 2,
        }),
      }}
    >
      <TextInput
        secureTextEntry={type === "password" && !showPassword}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={"#8F8F8F"}
        onChangeText={value}
        value={text}
        style={{
          color: "#8F8F8F",
          width: wp("90%"),
          height: hp("5.5%"),
          alignItems:"center"
        }}
      />

      {icon && (
        <View
          style={{
            marginRight: 4,
          }}
        >
          {icon}
        </View>
      )}

      {type === "password" ? (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: 8,
          }}
        >
          {showPassword ? (
            <EyeSlashIcon size={20} color="#1D9BF0" />
          ) : (
            <EyeIcon size={20} color="#1D9BF0" />
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Input;

interface IPassWordTextBox {
  value?: (value: string) => void;
  text?: string ;
}

export const PasswordTextBox = ({ value,text }: IPassWordTextBox) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: isFocused ? "#338AF3" : "#D0D5DD",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderRadius: 24,
        paddingHorizontal: 12,
        marginTop: 8,
        position: "relative",
        backgroundColor: "transparent",
      }}
    >
      <TextInput
        secureTextEntry={!showPassword}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Enter password"
        placeholderTextColor={"#8F8F8F"}
        onChangeText={value}
        value={text}
        style={{
          color: "#8F8F8F",
          width: wp("90%"),
          height: hp("5.5%"),
        }}
      />

      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: 8,
        }}
      >
        {showPassword ? (
          <EyeSlashIcon size={20} color="#1D9BF0" />
        ) : (
          <EyeIcon size={20} color="#1D9BF0" />
        )}
      </TouchableOpacity>
    </View>
  );
};
