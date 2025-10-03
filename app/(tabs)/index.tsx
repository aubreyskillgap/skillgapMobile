import { Device } from "@/services/device";
import { Logger } from "@/services/logger";
import { Router } from "@/services/router";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ArrowLeftIcon, ArrowRightIcon } from "react-native-heroicons/outline";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import texts from "../../constants/text";
import StepIndicator from "./auth/StepIndicator";
import SplashScreen from "./splashScreen";

const Onboarding = () => {
  const step1Img = require("../../assets/images/onboarding-step1.png");
  const step2Img = require("../../assets/images/onboarding-step2.png");
  const step3Img = require("../../assets/images/onboarding-step3.png");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);
  
  useEffect(() => {
    checkForFirstTimeInstallation();
  }, []);

  useEffect(() => {
    checkApproval();
  }, [isFirstTime]);

  const checkForFirstTimeInstallation = async () => {
    setIsLoading(true);

    const hasInstalledBefore = await Device.isRegistered();
    setIsFirstTime(!hasInstalledBefore);

    setIsLoading(false);
    Logger.info("Loading", isLoading);
  };

  const checkApproval = () => {
    if (!isFirstTime) {
      Router.push("/(tabs)/auth/auth-home");
    }
  };

  const nextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
     await Device.register();
   Router.push("/auth/auth-home");
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return isLoading ? (
    <SplashScreen />
  ) : (
    <>
      (
      <View
        style={{
          flex: 1,
          backgroundColor:
            step === 2 ? "#043F9A" : step === 3 ? "#032B69" : "#1D9BF0",
        }}
      >
        <View style={{ justifyContent: "flex-end", flex: 1, width: "100%" }}>
          {step === 1 && (
            <View
              style={{ justifyContent: "flex-end", flex: 1, width: "100%" }}
            >
              <Image
                source={step1Img}
                style={{
                  width: wp("100%"),
                  height: hp("60%"),
                  resizeMode: "contain",
                  alignSelf: "center",
                  transform: [
                    { translateX: -24 }, // -translate-x-6 × 4px
                    { translateY: 80 }, // translate-y-20 × 4px
                  ],
                }}
              />
            </View>
          )}

          {step === 2 && (
            <View
              style={{ justifyContent: "flex-end", flex: 1, width: "100%" }}
            >
              <Image
                source={step2Img}
                style={{
                  width: wp("100%"),
                  height: hp("60%"),
                  resizeMode: "contain",
                  alignSelf: "center",
                  transform: [
                    { translateX: -32 }, // -translate-x-8 × 4px
                    { translateY: 56 }, // translate-y-14 × 4px
                  ],
                }}
              />
            </View>
          )}

          {step === 3 && (
            <View
              style={{ justifyContent: "flex-end", flex: 1, width: "100%" }}
            >
              <Image
                source={step3Img}
                style={{
                  width: wp("100%"),
                  height: hp("60%"),
                  resizeMode: "contain",
                  alignSelf: "center",
                  transform: [
                    { translateX: -28 }, // -translate-x-7 × 4px
                    { translateY: 56 }, // translate-y-14 × 4px
                  ],
                }}
              />
            </View>
          )}
        </View>

        <View
          style={{
            backgroundColor: "#ffffff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            height: "30%",
          }}
        >
          {step <= 3 && (
            <>
              {/* Title & Description */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#020B12",
                    fontSize: 24,
                    fontWeight: "600",
                    marginBottom: 8,
                    fontFamily: "SpaceGrotesk",
                  }}
                >
                  {texts.onboardingData[step - 1].title}
                </Text>
                <Text
                  style={{
                    color: "#8F8F8F",
                    fontFamily: "GeneralSans-Variable",
                    fontWeight: "200",
                  }}
                >
                  {texts.onboardingData[step - 1].text}
                </Text>
              </View>

              {/* Footer with StepIndicator & Arrows */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: 12,
                }}
              >
                <StepIndicator currentStep={step} />

                <View style={{ flexDirection: "row", gap: 16 }}>
                  {/* Prev button (hidden on step 1) */}
                  <TouchableOpacity
                    onPress={previousStep}
                    style={
                      step === 1
                        ? { display: "none" }
                        : {
                            padding: 14,
                            borderWidth: 1,
                            borderColor: "#000",
                            borderRadius: 9999,
                          }
                    }
                  >
                    <ArrowLeftIcon size={15} color="#000" />
                  </TouchableOpacity>

                  {/* Next button */}
                  <TouchableOpacity
                    onPress={nextStep}
                    style={{
                      padding: 14,
                      borderWidth: 1,
                      borderColor: "#000",
                      borderRadius: 9999,
                    }}
                  >
                    <ArrowRightIcon size={15} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
      )
    </>
  );
};

export default Onboarding;
