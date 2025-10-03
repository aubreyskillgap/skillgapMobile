import { useTheme } from "@/hooks/useThemeContext";
import { formatNumber } from "@/services/formValidation";
import { formatDateDisplay } from "@/services/generateRandomHexNumber";
import { ITransaction } from "@/services/transaction";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

interface ITransactionList {
  data: ITransaction[];
}

const TransactionList = ({ data }: ITransactionList) => {
  const { theme } = useTheme();
  const renderItem = ({ item }: { item: ITransaction }) => (
    <TouchableOpacity
      //   onPress={() => click(item)}
      style={{
        marginBottom: 15,
        width: "95%",
        margin: "auto",
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left: Icon + Details */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View>
            {item.type === "deposit" ? (
              <View
                style={{
                  borderRadius: 100,
                  backgroundColor: theme === false ? "#E7F4FD" : "#27292B",
                  padding: 8,
                }}
              >
                <Image
                  source={require("../../../assets/icons/received.png")}
                  style={{ width: 20, height: 20, objectFit: "cover" }}
                />
              </View>
            ) : item.type === "withdrawal" ? (
              <View
                style={{
                  borderRadius: 100,
                  backgroundColor: theme === false ? "#E7F4FD" : "#27292B",
                  padding: 8,
                }}
              >
                <Image
                  source={require("../../../assets/icons/Send.png")}
                  style={{ width: 20, height: 20, objectFit: "cover" }}
                />
              </View>
            ) : (
              <View
                style={{
                  borderRadius: 100,
                  backgroundColor: theme === false ? "#E7F4FD" : "#27292B",
                  padding: 8,
                  height: 35,
                  width: 35,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../../assets/icons/contest.png")}
                  style={{ objectFit: "cover" }}
                />
              </View>
            )}
          </View>

          <View>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: "#8F8F8F",
                fontSize: 12,
                width: 175,
              }}
            >
              {item.initiator === "user" ? "To: " : "From: "}
              <Text style={{ color: "#FFFFFF", fontSize: 12 }}>
                {item.initiator}
              </Text>
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: "#6B7280", // Tailwind's text-gray-500
                fontSize: 14, // text-sm
                maxWidth: 160,
              }}
            >
              {formatDateDisplay(item.timeStamp ?? "")}
            </Text>
          </View>
        </View>

        {/* Right: Amount + Status */}
        <View
          style={{
            alignItems: "flex-end",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color:
                item.type === "withdrawal"
                  ? "#FB5631"
                  : item.type === "contest"
                  ? "#1D9BF0"
                  : "#2A9D0D",
              fontWeight: "bold",
              fontSize: 16,
              display: "flex",
              maxWidth: 80,
            }}
          >
            {item.type === "withdrawal"
              ? "-"
              : item.type === "contest"
              ? ""
              : "+"}
            {formatNumber(item.amount)}
          </Text>
          <View
            style={{
              paddingHorizontal: 7,
              paddingVertical: 3,
              borderRadius: 100,
              backgroundColor: theme === false ?
                item.state === "successful"
                  ? "#E2FEE6"
                  : item.state === "pending"
                  ? "#FDFAED"
                  : "#FFEEEB" : "#27292B",
            }}
          >
            <Text
              style={{
                color:
                  item.state === "successful"
                    ? "#2A9D0D"
                    : item.state === "pending"
                    ? "#DBBC1C"
                    : "#FB5631",
                fontWeight: "500", // font-medium
                fontSize: 14, // text-sm
              }}
            >
              {item.state === "successful"
                ? "Successful"
                : item.state === "pending"
                ? "Pending"
                : "Failed"}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: theme === false ? "#E7F4FD" : "#27292B",
          height: 1,
          margin: "auto",
          marginTop: 7,
          width: "96%",
        }}
      ></View>
    </TouchableOpacity>
  );
  return (
    <>
      <FlatList renderItem={renderItem} data={data} />
    </>
  );
};

export default TransactionList;
