import { useUserContext } from "@/hooks/useAppContext";
import { useTheme } from "@/hooks/useThemeContext";
import { IContest } from "@/services/contest";
import { formatNumber, timeAgo } from "@/services/formValidation";
import { Media } from "@/services/media";
import { Router } from "@/services/router";
import { SessionUser } from "@/services/user";
import { Text, TouchableOpacity, View } from "react-native";
import NetworkImage from "../networkImage";

interface ContestListItemProps {
  contest: IContest;
}

export const ContestListItem: React.FC<ContestListItemProps> = ({
  contest,
}) => {
  const { theme } = useTheme();
  const { user } = useUserContext();

  const isOnline =
    contest.ownerId === SessionUser?.id
      ? contest.opponent?.isOnline
      : contest.owner.isOnline;

  const state =
    contest.state === "pending"
      ? timeAgo(contest.timeStamp)
      : contest.state === "disputed"
      ? "Disputed"
      : contest.state === "ongoing"
      ? "ongoing"
      : contest.winnerId === SessionUser?.id
      ? "Won"
      : "Lost";

  const stateColor = ["pending", "disputed", "ongoing"].includes(contest.state)
    ? "#A1A1AA"
    : contest.winnerId === SessionUser?.id
    ? "#2A9D0D"
    : "#FB5631";

  return (
    <TouchableOpacity
      key={contest.id}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme == false ? "#FFFFFF" : "#1D1F20",
        borderRadius: 12,
        padding: 12,
        margin: 10,
        paddingHorizontal: 3,
        justifyContent: "space-between",
        marginBottom: 0,
        marginHorizontal: 0,
        paddingRight: 10,
      }}
      onPress={() => {
        Router.push(
          `/(tabs)/components/contest/myContestDetails?contestId=${contest.id}`
        );
      }}
    >
      {/* Left Section */}
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            alignItems: "center",
            borderWidth: contest.ownerId === user?.id ? 0 : 2,
            borderColor: contest.owner.isOnline ? "#4CD964" : "#EBF2FF",
            borderRadius: 100,
            position: "relative",
            left: 5,
          }}
        >
          <NetworkImage
            uri={Media.GetProfileImageUris(contest.owner.id ?? 0).small}
            loadingUri={require("../../../../assets/images/profile-img.png")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
          />
        </View>
        <View
          style={{
            alignItems: "center",
            borderWidth: contest.opponent?.id === user?.id ? 0 : 2,
            borderColor: contest.opponent?.isOnline ? "#4CD964" : "#EBF2FF",
            borderRadius: 100,
          }}
        >
          <NetworkImage
            uri={Media.GetProfileImageUris(contest.opponent?.id ?? 0).small}
            loadingUri={
              contest.opponent === null
                ? require("../../../../assets/images/unknownAvatar.png")
                : require("../../../../assets/images/profile-img.png")
            }
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            gap: 10,
            position: "relative",
            right: 6,
          }}
        >
          <View style={{ marginLeft: 12 }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: theme === false ? "#000000" : "#FFFFFF",
                  fontWeight: "600",
                  width: 130,
                }}
              >
                {contest.category.name}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ color: "#A1A1AA", fontSize: 12, maxWidth: 60 }}
              >
                @{contest.owner.tag}
              </Text>

              <Text
                style={{
                  fontWeight: 600,
                  color: theme === false ? "#000000" : "#FFFFFF",
                }}
              >
                {" "}
                {" vs "}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ color: "#A1A1AA", fontSize: 12, maxWidth: 60 }}
              >
                {contest.opponent ? ` @${contest.opponent?.tag}` : "  ?"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Right Section */}
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ color: stateColor, fontSize: 10 }}>{state}</Text>
        <Text
          style={{
            color: theme === false ? "#000000" : "#FFFFFF",
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          &#8358;{formatNumber(contest.stake)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
