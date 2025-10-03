import PageContainer from "@/components/Containers";
import { useUserContext } from "@/hooks/useAppContext";
import { useTheme } from "@/hooks/useThemeContext";
import { Logger } from "@/services/logger";
import { Router } from "@/services/router";
import { ToastBox } from "@/services/toast";
import {
  IAccountResolve,
  IBank,
  ITransaction,
  Transaction,
} from "@/services/transaction";
import { formatMoney } from "@/utitlity/string";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Banks from "../banks";

const Withdraw = () => {
  const { theme } = useTheme();
  const { user, transactionInfo } = useUserContext();

  const [showBanks, setShowBanks] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [bank, setBank] = useState<IBank | null>(null);
  const [bankNumber, setBankNumber] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [resolve, setResolve] = useState<IAccountResolve | null>({
    accountNumber: "0123456789",
    accountName: "Emmanuel Jackson",
    bankName: "First Bank of Nigeria",
    bankId: 1,
    amount: 50000,
  });
  const [test, setTest] = useState(true);
  const [transaction, setTransaction] = useState<
    ITransaction | "Failed" | null
  >(null);

  const currency = formatMoney(user?.balance ?? 0);
  const maxWithdrawalAmount = formatMoney(
    transactionInfo?.maxWithdrawalAmount ?? 0
  );
  const minWithdrawalAmount = formatMoney(
    transactionInfo?.minWithdrawalAmount ?? 0
  );
  const depositDarkImg = transaction === "Failed" ? (
    <Image source={require("../../../../assets/icons/depositFailedDark.png")} />
  ) : (
    <Image
      source={require("../../../../assets/icons/depositSuccessDark.png")}
    />
  );
  const depositLightImg = transaction === "Failed" ? (
    <Image
      source={require("../../../../assets/icons/depositFailedLight.png")}
    />
  ) : (
    <Image
      source={require("../../../../assets/icons/depositSuccessLight.png")}
    />
  );

  useFocusEffect(
    useCallback(() => {
      setBank(null);
      setIsLoading(false);
      setBankNumber("");
      setAmount(0);
      setResolve(null);
      setTransaction(null);
    }, [])
  );

  const onBankSelected = (newBank: IBank) => {
    if (!newBank) return;

    setShowBanks(false);
    // do nothing if we select the same bank
    if (bank && bank.id === newBank.id) return;

    setBank(newBank);
    setBankNumber("");
  };

  const resolveBank = async () => {
    const errors = [];
    if (!bank) errors.push("Please select a bank");
    if (!bankNumber) errors.push("Please enter a bank account number");
    if (amount <= 0 || amount > (user?.balance ?? 0))
      errors.push("Please enter a valid amount");

    if (errors.length > 0) {
      ToastBox("custom", errors[0]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await Transaction.resolveAccount(
        amount,
        bank?.id ?? -1,
        bankNumber
      );

      if (!result) {
        ToastBox("custom", "Please verify your account details.");
        return;
      }

      // resolve successful
      setResolve(result);
    } finally {
      setIsLoading(false);
    }
  };

  const initiateWithdrawal = async () => {
    if (!resolve) return;

    setIsLoading(true);
    try {
      const result = await Transaction.initiateWithdrawal(
        resolve.amount,
        resolve.bankId,
        resolve.accountNumber
      );
      Logger.info("transaction logs", result);

      if (!result) {
        setTransaction("Failed");
        return;
      }

      // successful
      setTransaction(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionDone = () => {
    if (transaction === null || transaction === "Failed") {
      setTransaction(null);
      return;
    }

    // route to transactions page
    // TODO : replace this with route to view this transaction
    Router.push("/(tabs)/mainApp/wallet");
  };

  return (
    <PageContainer backgroundColor={theme === false ? "#FAFAFA" : "#141414"}>
      {resolve ? (
        <ScrollView>
          <View style={{ justifyContent: "center" }}>
            <View
              style={{
                backgroundColor: theme === false ? "#FFFFFF" : "#1D1F20",
                padding: 20,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                alignItems: "center",
                borderColor: "#D1D5DB",
                width: "90%",
                margin: "auto",
                marginTop: 100,
                paddingBottom: 30,
              }}
            >
              <View style={{ position: "relative", height: 0, bottom: 75 }}>
                <Image
                  source={require("../../../../assets/icons/preview.png")}
                  style={{
                    marginBottom: 10,
                  }}
                  resizeMode="contain"
                />
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: theme === false ? "#111827" : "#FFFFFF",
                  marginBottom: 4,
                  paddingTop: 40,
                }}
              >
                Preview Transaction
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: "#6B7280", // gray-500
                  textAlign: "center",
                  paddingTop: 5,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                You want to withdraw{" "}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#6B7280",
                    borderWidth: 1,
                  }}
                >
                  ₦{resolve?.amount}
                </Text>{" "}
                from your account
              </Text>
            </View>{" "}
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#4B5563",
                borderStyle: "dashed",
                width: "90%",
                margin: "auto",
              }}
            />
            <View
              style={{
                backgroundColor: theme === false ? "#FFFFFF" : "#1D1F20",
                paddingVertical: 20,
                borderBottomRightRadius: 16,
                borderBottomLeftRadius: 16,
                margin: 20,
                marginTop: 30,
              }}
            >
              <View style={{ width: "90%", marginHorizontal: "auto" }}>
                <Text
                  style={{
                    color: theme === false ? "#020B12" : "#FFFFFF",
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 12,
                    paddingTop: 20,
                  }}
                >
                  Transaction Details
                </Text>
                <View style={{ marginTop: 12 }}>
                  {[
                    {
                      label: "Account Name",
                      value: `${resolve?.accountName ?? ""}`,
                    },
                    {
                      label: "Account Number",
                      value: `${resolve?.accountNumber ?? ""}`,
                    },
                    { label: "Bank Name", value: `${resolve.bankName}` },
                    {
                      label: "Amount",
                      value: `₦${
                        resolve?.amount ?? 0 > 0
                          ? `${resolve?.amount}`
                          : resolve?.amount ?? 0
                      }`,
                    },
                  ].map((item, index) => {
                    if (!item.value) {
                      return <></>;
                    }
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <Text
                          style={{
                            color: theme == false ? "#020B12" : "#8F8F8F",
                            fontSize: 14,
                          }}
                        >
                          {item.label}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            textTransform: "capitalize",
                            color: "#8F8F8F",
                            fontSize: 14,
                            textAlign: "right",
                            maxWidth: 180,
                          }}
                        >
                          {item.value}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={initiateWithdrawal}
            style={{
              width: wp("90%"),
              height: hp("7%"),
              borderRadius: 100,
              padding: 10,
              backgroundColor: "#1D9BF0",
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
                color: "#FFF",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {isLoading ? (
                <ActivityIndicator size={30} color={"#ffffff"} />
              ) : (
                "Confirm Payment"
              )}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={transaction !== null}
            transparent
            animationType="slide"
            onRequestClose={handleTransactionDone}
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
                <View
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
                      <View
                        style={{ alignItems: "center", marginBottom: "6%" }}
                      >
                        {" "}
                        {theme === false ? depositLightImg : depositDarkImg}
                      </View>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          color: theme === false ? "#000" : "#FFFFFF",
                          paddingBottom: 10,
                        }}
                      >
                        {transaction === "Failed" ? "Oops!" : "Congratulations"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: theme === false ? "#000" : "#fff",
                          paddingBottom: 30,
                        }}
                      >
                        {transaction === "Failed"
                          ? "Your transaction was not successful"
                          : "Your transaction was successful"}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setResolve(null);
                          setTransaction(null);
                        }}
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
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </ScrollView>
      ) : (
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
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "5%",
              width: "89%",
              margin: "auto",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: theme === false ? "#020B12" : "#ffffff",
                paddingTop: 30,
              }}
            >
              Withdraw
            </Text>
            <View>
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
                  fontSize: 16,
                  fontWeight: "600",
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
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Text
              style={{
                color: "#A3A3A3",
                marginLeft: 8,
                fontSize: 14,
                marginBottom: 5,
              }}
            >
              Bank Name
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: theme === false ? "#F2F2F7" : "#27292B",
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 30,
                paddingHorizontal: 16,
                paddingVertical: 8,
                justifyContent: "space-between",
              }}
              onPress={() => setShowBanks(!showBanks)}
            >
              <Text
                style={{
                  color: "#A3A3A3",
                  marginLeft: 8,
                  fontSize: 14,
                  textTransform: "capitalize",
                }}
              >
                {bank?.name ?? "Select Bank"}
              </Text>

              <Ionicons name="business" size={16} color="#A3A3A3" />
            </TouchableOpacity>
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
              Account Number
            </Text>

            <TextInput
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
              value={`${bankNumber}`}
              onChangeText={(val) => setBankNumber(val)}
            />

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
                color: theme === false ? "#000" : "#fff",
              }}
            >
              Amount
            </Text>

            <TextInput
              inputMode="numeric"
              value={amount.toString()}
             onChangeText={(val) => {
              const cleaned = val.replace(/[^0-9]/g, "");
              setAmount(Number(cleaned === "" ? null : parseInt(cleaned, 10)));
            }}
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                width: "98%",
                marginTop: 10,
                borderWidth: 1,
                borderColor: "#27292B",
                borderRadius: 100,
                padding: 10,
                fontSize: 14,
                color: theme === false ? "#000000" : "#ffffff",
                textAlignVertical: "top",
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginRight: 10,
                columnGap: 3,
                marginTop: 10,
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
                Min: &#8358;{minWithdrawalAmount.left}.{minWithdrawalAmount.right}
              </Text>
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
                Max: &#8358;{maxWithdrawalAmount.left}.{maxWithdrawalAmount.right}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={resolveBank}
            style={{
              width: wp("90%"),
              height: hp("7%"),
              borderRadius: 100,
              padding: 10,
              backgroundColor: "#E7F4FD",
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
                color: "#1D9BF0",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {isLoading ? (
                <ActivityIndicator size={30} color={"#ffffff"} />
              ) : (
                "Preview"
              )}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Modal
        visible={showBanks}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBanks(false)}
      >
        <TouchableWithoutFeedback>
          <View
            style={{
              height: "100%",
            }}
          >
            <BlurView
              intensity={80}
              tint="systemMaterialDark"
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableWithoutFeedback>
                <Banks
                  onSelected={onBankSelected}
                  close={() => setShowBanks(false)}
                />
              </TouchableWithoutFeedback>
            </BlurView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </PageContainer>
  );
};

export default Withdraw;
