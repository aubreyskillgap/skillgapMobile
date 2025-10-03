import { AuthSession } from "@/services/authSession";
import { Router } from "@/services/router";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import SplashScreen from "../splashScreen";

const AuthHome = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // reset routing history, this is a base-page
    Router.clearHistory();

    setIsLoading(true);
    // load auth state
    AuthSession.loadState()
      .then(() => {
        AuthSession.isAuthenticated().then((isAuthenticated) => {
          if (isAuthenticated) {
            Router.push("/(tabs)/mainApp");
          }
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return isLoading ? (
    <SplashScreen />
  ) : (
    <ImageBackground
      source={require("../../../assets/images/auth-home-bg.png")}
      resizeMode="cover"
      style={{height:hp("100%")}}
    >
      <View
      style={{backgroundColor:"transparent"}}
      >
        <Image
          source={require("../../../assets/images/auth-home-min.png")}
          style={{
            width: wp("100%"),
            height: hp("66%"),
            resizeMode: "contain",
 
          }}
        />
      </View>
      <Modal transparent={true}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            height: hp("40%"),
            position: "absolute",
            bottom:"0%",
            zIndex:1
     
          }}
        >
          <View style={{ alignItems: "center", paddingTop: 32 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#141414",
                marginBottom: 8,
                fontFamily: "SpaceGrotesk",
              }}
            >
              Skillgap
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                color: "#8F8F8F",
                fontWeight: "500",
                lineHeight: 22,
                marginBottom: 24,
              }}
            >
              Win cash completing bets using your preferred skill
            </Text>

            <TouchableOpacity
              onPress={() => {
                Router.push("/(tabs)/auth/sign-up");
              }}
              style={{
                width: wp("90%"),
                height: 56,
                borderRadius: 100,
                padding: 10,
                backgroundColor: "#1D9BF0",

                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: "auto",
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 14 }}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Router.push("/(tabs)/auth/login");
              }}
              style={{
                width: wp("90%"),
                height: 56,
                borderRadius: 100,
                padding: 10,
                backgroundColor: "transparent",
                borderColor: "#1D9BF0",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: "auto",
                borderWidth: 2,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "#1D9BF0", fontSize: 14 }}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"} hidden={true} />
    </ImageBackground>
  );
};

export default AuthHome;
