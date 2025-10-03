import PageContainer from "@/components/Containers";
import { useTheme } from "@/hooks/useThemeContext";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const ContestOutcome = () => {
    const {theme} = useTheme();
  return (
    <PageContainer
      paddingBottom="0"
      backgroundColor={theme == false ? "#FAFAFA" : "#141414"}
    >
      <ScrollView>
        <View style={{ justifyContent: "center" }}>
          <View style={{ left: 8 }}>
            <TouchableOpacity
              onPress={() => close()}
              style={{
                marginBottom: 12,
                width: 30,
                borderRadius: 9999,
                paddingLeft: 3,
                marginTop: 10,
              }}
            >
              <ChevronLeftIcon
                size={25}
                color={theme == false ? "#292D32" : "#ffffff"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <ImageBackground
            source={require("../../../../assets/images/profile-bg.png")}
            style={{ height: 140, width: "100%" }}
          ></ImageBackground>
        </View>

        <View
          style={{
            backgroundColor: theme == false ? "#ffffff" : "#1D1F20",
            width: "90%",
            marginHorizontal: "auto",
            marginTop: 10,
            position: "relative",
            paddingBottom: 10,
            bottom: 55,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: theme == false ? "#ffffff" : "#27292B",
              borderRadius: 10,
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
                Online
              </Text>
            </View>

            <Text style={{ fontSize: 16, color: "#1D9BF0", fontWeight: "700" }}>
              Table tennis
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
                }}
              >
                Pending
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              backgroundColor: theme == false ? "#ffffff" : "#1D1F20",
              padding: 16,
              borderRadius: 12,
            }}
          >
            <View
              style={{
                backgroundColor: theme == false ? "#ffffff" : "#27292B",
                paddingHorizontal: 30,
                paddingVertical: 15,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFF1C6",
                  padding: 8,
                  borderRadius: 9999,
                }}
              >
                <Image
                  source={require("../../../../assets/images/profile-bg.png")}
                  style={{ width: 40, height: 40, borderRadius: 9999 }}
                  resizeMode="cover"
                />
              </View>
              <Text
                style={{ color: "#3B82F6", fontSize: 16, fontWeight: "600" }}
              >
                @qubigs
              </Text>
              <View
                style={{
                  backgroundColor: theme == false ? "#E7F4FD" : "#27292B",
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: theme == false ? "#1D9BF0" : "#ffffff",
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  $500
                </Text>
              </View>
            </View>

            <Image
              source={require("../../../../assets/images/vs.png")}
              style={{ position: "relative", bottom: 15 }}
            />

            <View
              style={{
                backgroundColor: theme == false ? "#ffffff" : "#27292B",
                paddingHorizontal: 30,
                paddingVertical: 15,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../../../assets/images/unknownAvatar.png")}
                style={{ width: 50, height: 50, borderRadius: 9999 }}
              />
              <Text
                style={{ color: "#3B82F6", fontSize: 16, fontWeight: "600" }}
              >
                ?
              </Text>
              <View
                style={{
                  backgroundColor: theme == false ? "#E7F4FD" : "#27292B",
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: theme == false ? "#1D9BF0" : "#ffffff",
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  $500
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: theme == false ? "#FFFFFF" : "#1D1F20",
            position: "relative",
            bottom: 40,
            width: "90%",
            borderRadius: 12,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 10,
          }}
        >
          <Text
            style={{
              color: theme == false ? "#000000" : "#ffffff",
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Description
          </Text>
          <Text
            style={{
              color: "#8F8F8F",
              width: "100%",
              fontSize: 11,
              fontFamily: "General Sans Variable",
            }}
          >
            Bank (Amount, bank, account no) crypto (Network, address, scan QR
            code, amount, available balance, fee per $ ) Preview
          </Text>
        </View>

        <View
          style={{
            backgroundColor: theme == false ? "#FFFFFF" : "#1D1F20",
            position: "relative",
            bottom: 30,
            width: "90%",
            borderRadius: 12,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 10,
          }}
        >
          <Text
            style={{
              color: theme == false ? "#020B12" : "#ffffff",
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Contest Details
          </Text>
          <View style={{ marginTop: 12 }}>
            {[
              { label: "Created by:", value: "@qubigs" },
              { label: "Date & Time:", value: "13 Nov, 2023 | 12:42am" },
              { label: "Contest ID:", value: "sdsd-dfbkq-bjhede-jjahc-hdj" },
              { label: "SkillGap Fee:", value: "3.0%" },
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    color: theme == false ? "#020B12" : "#ffffff",
                    fontSize: 14,
                  }}
                >
                  {item.label}
                </Text>
                <Text
                  style={{
                    color: item.label === "Created by:" ? "#3B82F6" : "#9CA3AF",
                    fontSize: 14,
                  }}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            marginHorizontal: "auto",
            position: "relative",
            bottom: 20,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderLeftWidth: 4,
            borderLeftColor: "#FB5631",
            borderRadius: 4,
            paddingLeft: 12,
            paddingVertical: 4,
            width: "90%",
          }}
        >
          <View
            style={{
              width: 4,
              backgroundColor: "#EA580C",
              borderRadius: 9999,
              marginRight: 4,
            }}
          />
          <Text style={{ fontSize: 10, color: "#EA580C", flexShrink: 1 }}>
            We advise you keep all records and evidence during this contest for
            dispute resolution
            <Text
              style={{ fontWeight: "bold", textDecorationLine: "underline" }}
              onPress={() => {}}
            >
              {" "}
              Learn More
            </Text>
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              width: "43%",
              height: hp("6%"),
              borderRadius: 100,
              padding: 10,
              backgroundColor: "transparent",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: "auto",
              marginBottom: 10,
              borderWidth: 1,
              borderColor: "#1D9BF0",
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 16 }}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: "43%",
              height: hp("6%"),
              borderRadius: 100,
              padding: 10,
              backgroundColor: "#1D9BF0",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: "auto",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 16 }}>Edit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* {showWarningModal ? (
        <WarningModal
          proceed={() => {}}
          cancel={() => {setShowWarningModal(false)}}
          text="Are you sure you want to delete this contest"
        />
      ) : null} */}
    </PageContainer>
  );
};

export default ContestOutcome;
