import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import {
  emailValidation,
  passwordExactness,
  passwordValidation,
} from "@/services/formValidation";

import { AuthSession } from "@/services/authSession";
import { Logger } from "@/services/logger";
import { Router } from "@/services/router";
import { ToastBox } from "@/services/toast";
import { IUserDetail } from "@/types/auth";
import { useFocusEffect } from "@react-navigation/native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";

const SignUp = () => {
  const [country, setCountry] = useState<any>("NG");
  const [fullName, setFullName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [allValid, setAllValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inValidEmailText, setShowInValidEmailText] = useState(false);
  const [signupPayload, setSignupPayload] = useState<IUserDetail>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    password: "",
    darkMode: true,
  });

  useEffect(() => {
    setSignupPayload((prev: any) => ({
      ...prev,
      fullName,
      lastName,
      email,
      country,
      password,
    }));
  }, [password, email, fullName, confirmPassword]);

  useFocusEffect(
    useCallback(() => {
      setEmail("");
      setPassword("");
      setFullName("");
      setConfirmPassword("");
    }, [])
  );

  function checkForError() {
    if (fullName == "") {
      ToastBox("custom", "Fullname box is empty", {
        theme: false,
        types: false,
      });
      return false;
    } else if (!emailValidation(email)) {
      ToastBox("custom", "Email is not valid", {
        theme: false,
        types: false,
      });
      return false;
    } else if (!passwordValidation(password)) {
      ToastBox(
        "custom",
      
        "Password must be 8-12 characters long",
        {
          theme: false,
          types: false,
        }
      );
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

  const handleSignup = async () => {
    if (checkForError()) {
      setIsLoading(true);
      const response = await AuthSession.signup(
        email,
        fullName,
        password,
        false
      );
      if (response.success) {
        const loginSuccess = await AuthSession.login(email, password);
        if (loginSuccess) {
          Router.push("/(tabs)/auth/accountVerification");
        }
      } else {
        ToastBox("error", response.error);
        Logger.error(response.error);
      }
      setIsLoading(false);
    }
    return false;
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        flex: 1,
        height: hp("100%"),
        width: wp("100%"),
        paddingTop: 80,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          Router.back();
        }}
        style={{
          paddingLeft: 12,
          marginBottom: 24, // mb-6 → 6 × 4
          width: 30, // w-[30px]
          borderRadius: 9999,
        }}
      >
        <ChevronLeftIcon size={25} color={"#292D32"} />
      </TouchableOpacity>
      <Text
        style={{
          marginBottom: 24,
          paddingLeft: 12,
          fontSize: 24,
          fontWeight: "600",
          color: "#000",
        }}
      >
        Create Account
      </Text>{" "}
      <KeyboardAvoidingView
        style={{ height: hp("80%"), width: wp("100%"), flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={{ padding: 4 }}>
          <View style={{ width: wp("93%"), margin: "auto", marginBottom: 10 }}>
            <Label>Full name</Label>
            <Input
              type="text"
              placeholder="Enter full name"
              value={(e) => setFullName(e)}
              text={fullName}
            />
          </View>

          <View style={{ width: wp("93%"), margin: "auto", marginBottom: 10 }}>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter email address"
              value={(e) => setEmail(e)}
              text={email}
            />
          </View>
          <View style={{ width: wp("93%"), margin: "auto", marginBottom: 10 }}>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter password"
              value={(e) => setPassword(e)}
              text={password}
            />
            <View
              style={{
                display:
                  !passwordValidation(password) && password != ""
                    ? "flex"
                    : "none",
              }}
            ></View>
          </View>

          <View style={{ width: wp("93%"), margin: "auto", marginBottom: 10 }}>
            <Label>Confirm Password</Label>
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
          <TouchableOpacity
            onPress={handleSignup}
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
            }}
          >
            <Text
              style={{ color: allValid ? "#ffffff" : "#ffffff", fontSize: 14 }}
            >
              {isLoading ? (
                <ActivityIndicator size={30} color={"#ffffff"} />
              ) : (
                "Sign up"
              )}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        style={{
          width: wp("100%"),
          marginBottom: 20,
        }}
        className={`bg-white`}
      ></View>
      <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"}/>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    padding: 3,
    paddingLeft: 10,
    display: "flex",
    alignItems: "center",
    flexDirection: "row-reverse",
    borderRadius: 100,
    justifyContent: "space-between",
    borderColor: "#8F8F8F",
    borderStyle: "solid",
    borderWidth: 1,
    width: wp("93%"),
    margin: "auto",
  },
  label: {
    fontSize: 16,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: hp("4%"),
  },
  flag: {
    width: wp("0%"),
    height: 5,
    marginRight: 1,
  },
  text: {
    color: "red",
    fontSize: 14,
  },
});
