import PageContainer from "@/components/Containers";
import { useTheme } from "@/hooks/useThemeContext";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { useUserContext } from "@/hooks/useAppContext";
import { Router } from "@/services/router";
import { formatMoney, generateTxnRef } from "@/utitlity/string";
import { BlurView } from "expo-blur";
import { useFocusEffect } from "expo-router";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { usePaystack } from "react-native-paystack-webview";
import { PaystackTransactionResponse } from "react-native-paystack-webview/production/lib/types";

const CreateDeposit = () => {
  const { theme } = useTheme();
  const { popup } = usePaystack();
  const { user, transactionInfo } = useUserContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [depositStatus, setDepositStatus] = useState<
    "Success" | "Failed" | null
  >(null);
  const depositDarkImg =
    depositStatus === "Success" ? (
      <Image
        source={require("../../../../assets/icons/depositSuccessDark.png")}
      />
    ) : (
      <Image
        source={require("../../../../assets/icons/depositFailedDark.png")}
      />
    );
  const depositLightImg =
    depositStatus === "Success" ? (
      <Image
        source={require("../../../../assets/icons/depositSuccessLight.png")}
      />
    ) : (
      <Image
        source={require("../../../../assets/icons/depositFailedLight.png")}
      />
    );
  const currency = formatMoney(user?.balance ?? 0);

  useFocusEffect(
    useCallback(() => {
      setAmount(0);
      setIsLoading(false);
      setDepositStatus(null);
    }, [])
  );

  const initiateDeposit = async () => {
    if (!user || amount < (transactionInfo?.minAmount ?? 100) || isLoading)
      return;

    setIsLoading(true);
    popup.checkout({
      email: user.email,
      amount: amount,
      reference: generateTxnRef(),
      metadata: {
        UserId: user.id.toString(),
      },
      onSuccess: function (data: PaystackTransactionResponse): void {
        Keyboard.dismiss();
        setDepositStatus("Success");
      },
      onCancel: function (): void {
        Keyboard.dismiss();
        setDepositStatus("Failed");
      },
    });
    setIsLoading(false);
  };

  return (
    <PageContainer backgroundColor={theme === false ? "" : "#141414"}>
      <ScrollView
        style={{
          marginBottom: 2,
        }}
      >
        <View style={{ position: "absolute", top: 0, left: 12 }}>
          <TouchableOpacity
            onPress={() => {
              Router.back();
            }}
            style={{
              paddingLeft: 3,
              marginBottom: 24,
              width: 30,
              borderRadius: 9999,
            }}
          >
            <ChevronLeftIcon
              size={25}
              color={theme === false ? "#292D32" : "#fff"}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "1%",
            marginTop: "2%",
            width: "90%",
            margin: "auto",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: theme === false ? "#020B12" : "#ffffff",
              paddingTop: 30,
            }}
          >
            Deposit
          </Text>
          <View style={{}}>
            <Text
              style={{
                fontSize: 14,
                color: "#8F8F8F",
                fontWeight: 500,
                textAlign: "right",
              }}
            >
              Balance
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16, // 'text-base' → 16px
                fontWeight: "600", // 'font-semibold'
                color: theme === false ? "#020B12" : "#ffffff",
                textAlign: "right",
              }}
            >
              ₦{currency.left}.{currency.right}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: theme == false ? "#ffffff" : "#1D1F20",
            borderColor: theme == false ? "#E7F4FD" : "#27292B",
            borderWidth: 1,
            borderRadius: 8,
            width: "90%",
            marginLeft: "auto",
            marginRight: "auto",
            padding: 10,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              width: "96%",
              height: 21,
              fontFamily: "General Sans Variable",
              fontStyle: "normal",
              fontWeight: "500",
              fontSize: 14,
              lineHeight: 21,
              letterSpacing: -0.01,
              flexGrow: 0,
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 10,
              color: theme == false ? "#000" : "#fff",
            }}
          >
            Amount
          </Text>

          <TextInput
            placeholder="e.g #10,000"
            placeholderTextColor={"#8F8F8F"}
            inputMode="numeric"
            style={{
              borderWidth: 1,
              borderRadius: 20,
              borderColor: "#242628",
              width: "99%",
              height: 40,
              marginLeft: "auto",
              marginRight: "auto",
              color: theme === false ? "#000000" : "#ffffff",
              marginTop: 10,
              padding: 5,
              paddingLeft: 10,
              fontSize: 14,
            }}
            value={`${amount}`}
            onChangeText={(val) => {
              const cleaned = val.replace(/[^0-9]/g, "");
              setAmount(Number(cleaned === "" ? null : parseInt(cleaned, 10)));
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginRight: 10,
              columnGap: 3,
              marginTop: 5,
            }}
          >
            <Text
              style={{
                height: 17,
                fontFamily: "General Sans Variable",
                fontStyle: "italic",
                fontWeight: "400",
                fontSize: 11,
                lineHeight: 16.5,
                color: theme === false ? "#000" : "#fff",
              }}
            >
              &#8358;{transactionInfo?.minAmount ?? 100}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={initiateDeposit}
          style={{
            width: wp("90%"),
            height: hp("7%"),
            borderRadius: 100,
            padding: 10,
            backgroundColor:
              amount >= (transactionInfo?.minAmount ?? 100)
                ? "#1D9BF0"
                : "#8F8F8F",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: "auto",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size={30} color={"#ffffff"} />
            ) : (
              "Pay"
            )}
          </Text>
        </TouchableOpacity>
        <Modal
          visible={depositStatus !== null}
          transparent
          animationType="slide"
          onRequestClose={() => setDepositStatus(null)}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                backgroundColor: theme === false ? "#FAFAFA" : "#000",
              }}
            >
              <BlurView
                intensity={80}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 50,
                  paddingTop: 30,
                }}
              >
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      alignItems: "center",
                      width: "90%",
                    }}
                  >
                    <View style={{ alignItems: "center", marginBottom: "6%" }}>
                      {" "}
                      {theme === false ? depositLightImg : depositDarkImg}
                    </View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: "#FFFFFF",
                        paddingBottom: 10,
                      }}
                    >
                      {depositStatus === "Success"
                        ? "Congratulations"
                        : "Oops!"}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: theme === false ? "#000" : "#fff",
                        paddingBottom: 30,
                      }}
                    >
                      {depositStatus === "Success"
                        ? "Your transaction was successful"
                        : "Your transaction was not successful"}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setDepositStatus(null)}
                      style={{
                        alignItems: "center",
                        backgroundColor: "#3B82F6",
                        borderRadius: 16,
                        paddingHorizontal: 12,
                        paddingVertical: 12,
                        justifyContent: "center",
                        width: "90%",
                        margin: "auto",
                      }}
                    >
                      <Text
                        style={{
                          color: "#ffffff",
                          fontSize: 14,
                          fontWeight: "600",
                        }}
                      >
                        Done
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </BlurView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </PageContainer>
  );
};
export default CreateDeposit;
