import Input from "@/components/ui/Input";
import { AuthSession } from "@/services/authSession";
import {
  passwordExactness,
  passwordValidation,
} from "@/services/formValidation";
import { ToastBox } from "@/services/toast";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { IRecoverAccount } from ".";

const RecoverAccountPhase3 = ({ next, back }: IRecoverAccount) => {
  const [passwordLoader, setPasswordLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useFocusEffect(
    useCallback(() => {
      setPassword("");
      setConfirmPassword("");
    }, [])
  );

  function checkForError() {
    if (!passwordValidation(password)) {
      ToastBox("custom", "Password must be 8-12 characters long", {
        theme: false,
        types: false,
      });
      return false;
    } else if (!passwordExactness(password, confirmPassword)) {
      ToastBox("custom", "Password does not match", {
        theme: false,
        types: false,
      });
      return false;
    }

    return true;
  }
  const simulateApiReq = async () => {
    if (checkForError()) {
      setPasswordLoader(true);
      const success = await AuthSession.resetPassword(password);
      if (success) {
        next();
      } else {
        ToastBox("custom", "pls try that again", {
          theme: false,
          types: false,
        });
      }

      setPasswordLoader(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        paddingTop: 40,
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
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

        <Text
          style={{
            fontSize: 24,
            marginBottom: 40,
            fontWeight: "600",
            color: "#020B12",
          }}
        >
          Reset Password
        </Text>

        {/* Password Field */}
        <View style={{ width: "100%", marginBottom: 16 }}>
          <Text style={{ color: "#344054" }}>Password</Text>
          <Input
            type="password"
            placeholder="Enter new password"
            value={(e) => setPassword(e)}
            text={password}
          />
          <View
            style={{
              display:
                !passwordValidation(password) && password !== ""
                  ? "flex"
                  : "none",
            }}
          ></View>
        </View>

        {/* Confirm Password Field */}
        <View style={{ width: "100%", marginBottom: 20 }}>
          <Text style={{ color: "#344054" }}>Confirm Password</Text>
          <Input
            type="password"
            placeholder="Confirm password"
            value={(e) => setConfirmPassword(e)}
            text={confirmPassword}
          />
          <View
            style={{
              display: !passwordExactness(password, confirmPassword)
                ? "flex"
                : "none",
            }}
          ></View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={() => {
            simulateApiReq();
          }}
          style={{
            width: "99%",
            height: 56,
            borderRadius: 100,
            padding: 10,
            backgroundColor: "#1D9BF0",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 0,
            alignSelf: "center",
          }}
        >
          {passwordLoader ? (
            <ActivityIndicator size={30} color="#ffffff" />
          ) : (
            <Text style={{ color: "#ffffff", fontSize: 14 }}>
              Save Password
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecoverAccountPhase3;
