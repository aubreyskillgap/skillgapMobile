import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface ICustomButton {
  title?: string;
  handlePress?: () => void;
  disabled?: boolean;
  className?: String;
  isLoading?: boolean;
  outline?: boolean;
  textStyle?: string;
  icon?: String;
}
const CustomButton = ({
  title,
  handlePress,
  disabled,
  className,
  isLoading,
  outline,
  textStyle,
  icon,
}: ICustomButton) => {
  return (
  <TouchableOpacity
  onPress={handlePress}
  disabled={disabled}
  style={{
    width: '100%',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 56,
    borderRadius: 40,
    ...(outline
      ? { borderWidth: 1, borderColor: '#1D9BF0' }
      : { backgroundColor: '#1D9BF0' }),
    ...(isLoading ? { opacity: 0.5 } : {}),
    ...(disabled
      ? { opacity: 0.8, backgroundColor: '#B0C4DE' }
      : {}),
  }}
>
  {isLoading && (
    <ActivityIndicator
      size="small"
      color="#fff"
      style={{ marginRight: 8 }}
    />
  )}
  <Text
    style={{
      fontWeight: '600',
      color: outline ? '#1D9BF0' : '#fff',
    }}
  >
    {title}
  </Text>
  <View style={{ marginLeft: 8 }}>
    {icon}
  </View>
</TouchableOpacity>
  );
};

export default CustomButton;
