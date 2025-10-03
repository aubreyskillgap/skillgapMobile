import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const CustomToast = ({ text1, text2, props }: any) => {
  const { theme, types } = props;

  const styles = StyleSheet.create({
    toastContainer: {
      backgroundColor: theme ? "#fff":"#1E1E1E",
      borderRadius: 20,
      padding: 16,
      marginHorizontal: 16,
      position:"relative",
      bottom:30
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    textContainer: {
      flexShrink: 1,
    },
    title: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    message: {
      color: "#ccc",
      fontSize: 16,
      marginTop: 4,
      fontWeight: 600,
    },
    successBar: {
      marginTop: 10,
      height: 4,
      backgroundColor: types ? "#1D9BF0" : "red",
      borderRadius: 2,
    },
  });

  return (
    <View style={styles.toastContainer}>
      <View style={styles.row}>
        <View style={{ backgroundColor: "#fff", position: "absolute",borderWidth:1,width:13,height:12,left:6 }}></View>
        {types ? (
          <Ionicons
            style={{ position: "relative" }}
            name="checkmark-circle"
            size={24}
            color="#1D9BF0"
          />
        ) : (
          <Ionicons name="close-circle" size={24} color="#EA424A" />
        )}

        <View style={styles.textContainer}>
          <Text style={styles.message}>{text2}</Text>
        </View>
      </View>
    </View>
  );
};

export default CustomToast;
