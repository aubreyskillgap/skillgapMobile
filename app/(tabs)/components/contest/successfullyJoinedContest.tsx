import { useTheme } from "@/hooks/useThemeContext";
import { IContest } from "@/services/contest";
import { Media } from "@/services/media";
import { Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import SplashScreen from "../../splashScreen";
import NetworkImage from "../networkImage";

interface SuccessfullyJoinedContestProps {
  contest: IContest;
  onRoute: () => void;
}

const SuccessfullyJoinedContest: React.FC<SuccessfullyJoinedContestProps> = ({
  contest,
  onRoute,
}) => {
  const { theme } = useTheme();

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
          maxWidth: 384, // max-w-md = 384px
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 6, // Android shadow
          backgroundColor: theme === false ? "#ffffff" : "#000000", // to avoid transparent view
        }}
      >
        {" "}
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <NetworkImage
            uri={Media.GetProfileImageUris(contest.owner.id ?? 0).small}
            loadingUri={require("../../../../assets/images/profile-img.png")}
            style={{
              width: 60,
              height: 60,
              borderRadius: 20,
            }}
          />

          <NetworkImage
            uri={Media.GetProfileImageUris(contest.opponent?.id ?? 0).small}
            loadingUri={require("../../../../assets/images/profile-img.png")}
            style={{
              width: 60,
              height: 60,
              borderRadius: 100,
              position: "relative",
              right: 10,
            }}
          />
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
          You have successfully joined a the contest with <Text style={{fontSize:15,fontWeight:700}}>@{contest.owner.tag}</Text>.
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

export default SuccessfullyJoinedContest;
