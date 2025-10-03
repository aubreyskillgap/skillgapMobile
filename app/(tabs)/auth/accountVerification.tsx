import { AuthSession } from "@/services/authSession";
import { Logger } from "@/services/logger";
import { Router } from "@/services/router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import OTPTextInput from "react-native-otp-textinput";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
const INITIAL_TIME = 60;

const AccountVerification = () => {
  const [otp, setOtp] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_TIME);
  const [showResend, setShowResend] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [startTimer, setStartTimer] = useState(true);
  const [loading, setIsLoading] = useState(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    Router.clearHistory();
  }, []);

  useEffect(() => {
    if (!startTimer) return; // Timer only starts when `startTimer` is true

    if (secondsRemaining <= 0) {
      setShowResend(true);
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, startTimer]);

  const handleVerifyOtp = async () => {
    setOtpLoader(true);
    const success = await AuthSession.verifyEmail(otp);
    if (success) {
      Router.push("/(tabs)/mainApp");
    } else {
      // TODO :: replace it with toast message to user
      Logger.error("Email verification failed");
    }
    setOtpLoader(false);
  };

  const resendStyles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    etaText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "gray",
      marginRight: 10,
    },
    timerText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#000000",
    },
    resendContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    errorText: {
      fontSize: 16,
      color: "gray",
    },
    resendText: {
      fontSize: 16,
      color: "#1D9BF0",
      fontWeight: "bold",
      textDecorationLine: "underline",
    },
  });

  const handleResend = () => {
    AuthSession.sendVerifyCode();
    setSecondsRemaining(INITIAL_TIME);
    setShowResend(false);
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
        style={{
          flex: 1,
          paddingHorizontal: 16, // px-4
          paddingVertical: 36,
        }}
      >
        <Text
          style={{
            fontSize: 24, // text-2xl
            marginBottom: 12, // mb-3 = 3 * 4
            fontWeight: "600", // font-semibold
            color: "#020B12",
          }}
        >
          Verify Account
        </Text>

        <Text
          style={{
            color: "#000000",
            marginTop: 30,
            marginBottom: 10,
          }}
        >
          Enter OTP sent to your email address.
        </Text>

        <View
          style={{
            width: wp("90%"),
            alignSelf: "center",
            marginTop: 16, // mt-4 = 4 * 4
          }}
        >
          <OTPTextInput
            handleTextChange={setOtp}
            containerStyle={{
              justifyContent: "space-evenly",
              marginBottom: hp("2%"),
              width: wp("90%"),
              alignSelf: "center",
            }}
            textInputStyle={{
              width: wp("12%"),
              height: hp("6.5%"),
              fontSize: wp("4%"),
              borderRadius: wp("2%"),
              textAlign: "center",
              borderWidth: 2,
              borderColor: "#FAFAFA",
              color: "#344054",
            }}
            inputCount={6}
            tintColor="#338AF3"
          />
        </View>

        <View style={resendStyles.container}>
          {!showResend ? (
            <>
              <Text style={resendStyles.etaText}>ETA</Text>
              <Text style={resendStyles.timerText}>
                {formatTime(secondsRemaining)}
              </Text>
            </>
          ) : (
            <View style={resendStyles.resendContainer}>
              <Text style={resendStyles.errorText}>Did not get the email?</Text>
              <TouchableOpacity onPress={handleResend}>
                <Text style={resendStyles.resendText}>Resend</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleVerifyOtp}
          disabled={otp.length < 6}
          style={{
            width: "99%",
            height: 56,
            borderRadius: 100,
            padding: 10,
            backgroundColor: !(otp.length < 6) ? "#1D9BF0" : "#8F8F8F",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginTop: 24,
          }}
        >
          {otpLoader ? (
            <ActivityIndicator size={30} color="#ffffff" />
          ) : (
            <Text
              style={{
                color: "#ffffff",
                fontSize: 14,
              }}
            >
              Verify OTP
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountVerification;
