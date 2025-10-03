import PageContainer from "@/components/Containers";
import { Router } from "@/services/router";
import React, { ReactNode, useState } from "react";
import { ActivityIndicator, Modal, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import SplashScreen from "../splashScreen";

interface ITransactionPin {
  children: ReactNode;
}

const TransactionPin = ({ children }: ITransactionPin) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible,setIsVisible] = useState(false)

  const handleKeyPress = (value: any) => {
    const newPin = [...pin];
    const nextEmptyIndex = newPin.findIndex((digit) => digit === "");

    if (value === "backspace") {
      const lastFilledIndex = newPin.findLastIndex((digit) => digit !== "");
      if (lastFilledIndex !== -1) newPin[lastFilledIndex] = "";
    } else if (value === "ok") {
      if (newPin.every((digit) => digit !== "")) {
        // onSetTransactionPin(newPin.join(''));
        simulateApiReq();
      }
    } else if (nextEmptyIndex !== -1) {
      newPin[nextEmptyIndex] = value;
    }

    setPin(newPin);
  };

   const simulateApiReq = () => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
        
        Router.push("/(tabs)/mainApp");
      }, 1000);
      return false;
    };

  return isLoading ? (
    <SplashScreen />
  ) : (
    <PageContainer  backgroundColor="#ffffff">
      <ScrollView style={{ flex: 1, paddingHorizontal: 16,paddingTop:50 }}>
        <TouchableOpacity
          onPress={() => Router.back()}
          style={{
            paddingLeft: 3,
            marginBottom: 24, // mb-6
            width: 30, // w-[30px]
            borderRadius: 9999,
          }}
        >
          <ChevronLeftIcon size={25} color="#292D32" />
        </TouchableOpacity>

        <Text
          style={{
            marginBottom: 12,
            fontSize: 24,
            fontWeight: "600",
            color: "#020B12",
          }}
        >
          Create PIN
        </Text>
        <Text style={{ fontSize: 14, color: "#344054" }}>
          Create a 4 digit pin for your account to help us authenticate any
          transaction in your account
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 32,
          }}
        >
          {pin.map((digit, index) => (
            <View
              key={index}
              style={{
                width: 48, // w-12
                height: 48, // h-12
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 12, // rounded-xl
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 8, // mx-2
                backgroundColor: "#FAFAFA",
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "600" }}>{digit}</Text>
            </View>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            padding: 8, // p-2
            borderRadius: 16, // rounded-2xl
            backgroundColor: "#E7F4FD",
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "backspace", 0, "ok"].map(
            (key, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleKeyPress(key)}
                style={{
                  width: "30%", // w-[30%]
                  marginVertical: 12, // my-3
                  height: 64, // h-16
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {key === "backspace" ? (
                  <ChevronLeftIcon size={30} color="#1D9BF0" />
                ) : (
                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: 18,
                      color: "#1D9BF0",
                    }}
                  >
                    {key}
                  </Text>
                )}
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>
      <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={() => {}}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.25)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
       
          <ActivityIndicator size="large" color="#fff" />
       
      </View>
    </Modal>
    <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"}/>
    </PageContainer>
  );
};

export default TransactionPin;
