import { Router } from "@/services/router";
import { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import successImg from "../../../../assets/images/success-img.png";

interface IPhase4{
  next: ()=>void;
}
const RecoverAccountPhase4 = ({next}:IPhase4) => {
  useEffect(() => {
    Router.clearHistory();
  }, []);

  return (
    <View style={{backgroundColor:"#fff",height:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Image
          source={successImg}
          style={{
            width: 100,
            height: 100,
            marginBottom: 20,
          }}
        />

        <Text
          style={{
            fontSize: 24,
            fontWeight: "600",
            marginBottom: 4,
            color: "#020B12",
          }}
        >
          Congratulations
        </Text>

        <Text
          style={{
            color: "#344054",
            fontWeight: "500",
            marginBottom: 40,
          }}
        >
          Your password reset was successful
        </Text>

        <TouchableOpacity
          onPress={() => {
            next()
            Router.clearHistory();
            Router.push("/(tabs)/auth/login");
          }}
        >
          <Text
            style={{
              color: "#1D9BF0",
              fontWeight: "500",
            }}
          >
            Proceed to login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecoverAccountPhase4;
