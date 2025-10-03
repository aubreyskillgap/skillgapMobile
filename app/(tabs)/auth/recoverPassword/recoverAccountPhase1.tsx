import Input from "@/components/ui/Input";
import { AuthSession } from "@/services/authSession";
import { emailValidation } from "@/services/formValidation";
import { ToastBox } from "@/services/toast";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { IRecoverAccount } from ".";

const RecoverAccountPhase1 = ({ next, back }: IRecoverAccount) => {
  const [email, setEmail] = useState("placeholder@gmail.com");
  const [proceedLoader, setProceedLoader] = useState(false);

  const handleEmailSubmission = async () => {
    if (emailValidation(email)) {
      setProceedLoader(true);

      const success = await AuthSession.sendPasswordResetCode(email);
      if (success) {
        next();
        return;
      } else {
        ToastBox("custom", "Something went wrong try again", {
          theme: false,
          types: false,
        });
        return;
      }
    }
    ToastBox("custom", "Email is not valid", { theme: false, types: false });
  };

  useFocusEffect(
    useCallback(() => {
      setEmail("");
    }, [])
  );

  return (
    <SafeAreaView
      style={{
        paddingTop: 40,
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 40,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            back();
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

        <View>
          <Text
            style={{
              fontSize: 24, // text-2xl
              fontWeight: "600", // font-semibold
              color: "#020B12",
            }}
          >
            Account Verification
          </Text>

          <Text
            style={{
              color: "#000000",
              marginTop: 30,
              marginBottom: 10,
            }}
          >
            Enter email address associated with your existing account to receive
            a verification code
          </Text>

          <Input
            type="email"
            placeholder="Enter Email"
            value={(e) => setEmail(e)}
            text={email}
          />

          <TouchableOpacity
            onPress={handleEmailSubmission}
            style={{
              width: "99%",
              height: 56,
              borderRadius: 100,
              padding: 10,
              backgroundColor: "#1D9BF0",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
              alignSelf: "center", // replaces margin: "auto"
            }}
          >
            {proceedLoader ? (
              <ActivityIndicator size={30} color="#ffffff" />
            ) : (
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 14,
                }}
              >
                Proceed
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecoverAccountPhase1;
