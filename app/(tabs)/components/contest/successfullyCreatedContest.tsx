import { useTheme } from "@/hooks/useThemeContext";
import { IContest } from "@/services/contest";
import { Media } from "@/services/media";
import { Router } from "@/services/router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import SplashScreen from "../../splashScreen";
import NetworkImage from "../networkImage";

interface SuccessfullyCreatedContestProps {
  contest: IContest;
  onRoute: () => void;
}

const SuccessfullyCreatedContest: React.FC<SuccessfullyCreatedContestProps> = ({
  contest,
  onRoute,
}) => {
  const { theme } = useTheme();

  useEffect(()=>{
    Router.back();
  })

  return contest === null ? (
    <SplashScreen />
  ) : (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24, // px-6 = 6 * 4
        backgroundColor: theme === false ? "#ffffff" : "#000000",
      }}
    >
      <View
        style={{
          marginRight: "auto",
          marginLeft: "auto",
          borderRadius: 12, // rounded-xl
          paddingHorizontal: 24, // px-6
          paddingVertical: 40, // py-10 = 10 * 4
          width: "100%",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 6, // Android shadow
          backgroundColor: theme === false ? "#ffffff" : "#000000",
        }}
      >
        <View style={{flexDirection:"row"}}>
          <NetworkImage
            uri={Media.GetProfileImageUris(contest.owner.id ?? 0).small}
            loadingUri={require("../../../../assets/images/profile-img.png")}
            style={{
              width: 50,
              height: 50,
              borderRadius:100
            }}
          />
          {contest.isOpen ? 
          <NetworkImage
            uri={""}
            loadingUri={require("../../../../assets/images/unknownAvatar.png")}
            style={{
              width: 50,
              height: 50,
              position:"relative",
              right:10,
              borderRadius:100
              
            }}
          /> : <NetworkImage
            uri={Media.GetProfileImageUris(contest?.opponent?.id ?? 0).small}
            loadingUri={require("../../../../assets/images/profile-img.png")}
            style={{
              width: 50,
              height: 50,
              position:"relative",
              right:10,
              borderRadius:100
            }}
          />}
        </View>
        <Text
          style={{
            color: "#ffffff",
            fontSize: 20, // text-xl
            fontWeight: "bold",
            marginBottom: 8, // mb-2
          }}
        >
          It’s about to get real
        </Text>

        <Text
          style={{
            color: "#9ca3af", // text-gray-400
            fontSize: 14, // text-sm
            textAlign: "center",
            marginBottom: 24, // mb-6
          }}
        >
          {contest.isOpen
            ? "Your open contest has been created, you will be notified once an opponent joins."
            : <Text>  Your contest request has been sent to  @<Text style={{fontWeight:700,fontSize:15}}>{contest.opponent?.tag}</Text> successfully. You will be notified once they give a response</Text>}
        </Text>

        <TouchableOpacity
          onPress={onRoute}
          style={{
            width: "100%",
            height: hp("7.5%"),
            borderRadius: 100,
            padding: 10,
            backgroundColor: "#1D9BF0",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            My contests
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SuccessfullyCreatedContest;
