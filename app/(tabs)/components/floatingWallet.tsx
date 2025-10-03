import { useUserContext } from "@/hooks/useAppContext";
import { useTheme } from "@/hooks/useThemeContext";
import { Router } from "@/services/router";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FloatingWalletProps {
  refreshing: boolean;
}

const FloatingWallet: React.FC<FloatingWalletProps> = (refreshing) => {
  const { getUserBalance } = useUserContext();
  const { theme } = useTheme();

  const balance = getUserBalance();

  return (
    <ImageBackground
      source={require("../../../assets/images/sk-bg.png")}
      resizeMode="repeat"
      imageStyle={{ borderRadius: 8 }}
      style={{
        backgroundColor: "#1A12BC",
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <View style={styles.overlay}>
        <Text
          style={{
            color: "#FFFFFF",
            textAlign: "center",
            fontSize: 12,
            fontWeight: "500",
            marginBottom: 16,
          }}
        >
          Wallet Balance
        </Text>

        <View style={{ gap: 8, marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              &#8358;
              {balance.left}
            </Text>
            <Text style={{ fontSize: 14, color: "#FFFFFF" }}>
              .{balance.right}
            </Text>{" "}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#FFFFFF",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              width: 90,
              display: "flex",
              justifyContent: "center",
            }}
            onPress={() => Router.push("/(tabs)/components/wallet/withdraw")}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "500",
                color: "#FFFFFF",
              }}
            >
              Withdraw
            </Text>
            <Image
              source={require("../../../assets/icons/withdraw-icon.png")}
              style={{ width: 12, height: 12, marginLeft: 4 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 10,
                position: "relative",
                bottom: 15,
                textDecorationLine: "underline",
              }}
              onPress={() => Router.push("/mainApp/wallet")}
            >
              Transaction History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#FFFFFF",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              width: 90,
              display: "flex",
              justifyContent: "center",
            }}
            onPress={() => Router.push("/(tabs)/components/wallet/deposit")}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "500",
                color: "#1A12BC",
              }}
            >
              Deposit
            </Text>
            <Image
              source={require("../../../assets/icons/deposit-icon.png")}
              style={{ width: 12, height: 12, marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(26, 18, 188, 0.8)",
    borderRadius: 8,
    padding: 16,
  },
});
export default FloatingWallet;
