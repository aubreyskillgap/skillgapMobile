import { useTheme } from "@/hooks/useThemeContext";
import { IContest } from "@/services/contest";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const mockMessages = [
  {
    id: "1",
    avatar: require("../../../assets/images/profile-img.png"),
    time: "12th Oct, 2023 | 8:04pm",
    message:
      "Bank (Amount, bank, account no) crypto (Network, address, scan QR code, amount, available balance, fee per $ ) Preview",
  },
  {
    id: "2",
    avatar: require("../../../assets/images/profile-img.png"),
    time: "Yesterday | 10:42am",
    message: "Bank (Amount, bank, account no) crypto (Network,",
  },
  {
    id: "3",
    avatar: require("../../../assets/images/profile-img.png"),
    time: "Today | 1:37pm",
    message:
      "Bank (Amount, bank, account no) crypto (Network, address, scan QR code, amount, available balance, fee per $ ) Preview",
  },
];

interface CommentProps {
  contest: IContest;
}

const Comment = ({ contest }: CommentProps) => {
    const {theme} = useTheme();
  const [text, setText] = useState("");
  const [data, setData] = useState(mockMessages);
  const flatListRef = useRef(null);

  const handleSend = () => {
    const newMessage = {
      id: Date.now().toString(),
      avatar: require("../../../assets/images/profile-img.png"),
      time: "Now",
      message: text,
    };
    setData((prev) => [...prev, newMessage]);
    setText("");
  };

  const styles = StyleSheet.create({
    messageWrapper: {
      marginBottom: 16,
    },
    timeText: {
      alignSelf: "center",
      fontSize: 11,
      color: "#888",
      marginBottom: 6,
    },
    chatRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginRight: 8,
    },
    bubble: {
      backgroundColor: "#1EA7FD",
      padding: 10,
      borderRadius: 15,
      maxWidth: "85%",
    },
    messageText: {
      color: "#fff",
      fontSize: 14,
    },
    inputContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#1C1C1C",
      paddingHorizontal: 16,
      paddingVertical: 10,
      margin: 10,
      borderRadius: 999,
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: "#ffffff",
    },
    sendButton: {
      backgroundColor: "#1EA7FD",
      padding: 10,
      borderRadius: 999,
      marginLeft: 8,
    },
  });

  const renderChat = ({ item }: { item: any }) => (
    <View style={styles.messageWrapper}>
      <Text style={styles.timeText}>{item.time}</Text>
      <View style={styles.chatRow}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.bubble}>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 30}
        style={{ flex: 1, backgroundColor: "#0F0F0F" }}
      >
        <View style={{ flex: 1 }}>
          {/* Top Info Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 15,
              backgroundColor: theme == false ? "#ffffff" : "#27292B",
              borderRadius: 10,
              width: "95%",
              alignSelf: "center", // instead of margin: "auto"
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 4,
                borderRadius: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: "600",
                  backgroundColor: theme == false ? "#FFFAE5" : "#E2FEE6",
                  color: "#22C55E",
                }}
              >
                {contest?.owner?.isOnline ? "Online" : "Offline"}
              </Text>
            </View>

            <Text style={{ fontSize: 16, color: "#1D9BF0", fontWeight: "700" }}>
              {contest.category.name}
            </Text>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 4,
                borderRadius: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: "600",
                  backgroundColor: theme == false ? "#FFFAE5" : "#27292B",
                  color: "#FFDA44",
                  textTransform: "capitalize",
                }}
              >
                {contest.state}
              </Text>
            </View>
          </View>

          {/* Creator Info */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 6,
              paddingLeft: 5,
              alignItems: "center",
              borderRadius: 6,
              marginTop: 10,
              paddingRight: 20,
            }}
          >
            <Text
              style={{
                color: "#CFCFCF",
                fontSize: 11,
                fontWeight: "400",
                backgroundColor: theme == false ? "#ffffff" : "#1A1A1A",
                paddingHorizontal: 8,
                borderRadius: 20,
                paddingVertical: 5,
              }}
            >
              Contest was created by{" "}
              <Text style={{ color: "#3B82F6" }}>@{contest?.owner?.tag}</Text>{" "}
              On {contest.timeStamp}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 10,
              }}
            >
              <Ionicons name="eye-outline" size={14} color="#3B82F6" />
              <Text style={{ color: "#3B82F6", fontSize: 13, marginLeft: 4 }}>
                32 Views
              </Text>
            </View>
          </View>

          <FlatList
            ref={flatListRef}
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderChat}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.inputContainer}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type your thoughts about this contest here"
              placeholderTextColor="#999999"
              style={styles.input}
            />

            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Ionicons name="send" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Comment;
