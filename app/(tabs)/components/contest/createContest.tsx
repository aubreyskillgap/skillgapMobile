import PageContainer from "@/components/Containers";
import Input from "@/components/ui/Input";
import { useUserContext } from "@/hooks/useAppContext";
import { useTheme } from "@/hooks/useThemeContext";
import { Contest, IContest, IContestCategory } from "@/services/contest";
import {
  useDebounce,
  validateCreateContestForm,
} from "@/services/formValidation";
import { Logger } from "@/services/logger";
import { Router } from "@/services/router";
import { ToastBox } from "@/services/toast";
import { IOtherUserRecord, User } from "@/services/user";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import Categories from "../categories";
import GetColoredCategoryBubbles from "../coloredCategorybubbles";
import SuccessfullyCreatedContest from "./successfullyCreatedContest";

const CreateContest = () => {
  const { theme } = useTheme();
  const { getUserBalance } = useUserContext();
  const { transactionInfo } = useUserContext();
  const minStake = transactionInfo?.minStake ?? 0;

  const [isOffline, setIsOffline] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [categoriesMap, setCategoriesMap] = useState<IContestCategory[]>([]);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [stake, setStake] = useState<number>(0);
  const [skillTag, setSkillTag] = useState("");
  const [opponentRecord, setOpponentRecord] =
    useState<IOtherUserRecord | null>();

  const [characterValue, setCharacterValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createdContest, setCreatedContest] = useState<IContest | null>(null);
  const [tagError, setTagError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      resetValues();
    }, [])
  );
  const debouncedSearch = useCallback(
    useDebounce(() => {
      skillTag &&
        User.getUserByTag(skillTag).then((response) => {
          setTagError(response === null);
          setOpponentRecord(response);
        });
    }, 500),
    [skillTag]
  );

  useEffect(() => {
    setCreatedContest(null);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      debouncedSearch();
    }, 500);
    return () => clearTimeout(handler);
  }, [skillTag]);

  const maxChars = 1000;

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: theme == false ? "#EDEFF1" : "#1D1F20",
      borderRadius: 100,
      padding: 5,
      alignItems: "center",
      justifyContent: "space-between",
      width: "90%",
      alignSelf: "center",
    },
    blockButton: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 100,
      alignItems: "center",
      backgroundColor: !isOffline
        ? "transparent"
        : theme == false
        ? "#FFFFFF"
        : "#141414",
    },
    viewBlockListButton: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 100,
      backgroundColor: !isOffline
        ? theme == false
          ? "#FFFFFF"
          : "#141414"
        : "transparent",
      alignItems: "center",
    },
    text: {
      color: "#8F8F8F",
      fontSize: 14,
    },
  });

  const onCategorySelected = (categories: IContestCategory[]) => {
    setShowCategories(false);
    if (categories) {
      const map = [...categories];
      setCategoriesMap(map);
      const category = categories.pop();
      setCategoryId(category?.id ?? null);
    }
  };

  const balance = getUserBalance();

  const handleSubmit = async () => {
    const formError = validateCreateContestForm(
      categoryId,
      stake,
      characterValue,
      isChallengeOpen,
      minStake,
      tagError,
      skillTag
    );
    if (formError != null) {
      ToastBox("custom", formError);
      return;
    }

    setIsLoading(true);
    const result = await Contest.createContest({
      stake: stake,
      description: characterValue,
      opponentId: opponentRecord?.id ?? null,
      isOpen: isChallengeOpen,
      isOffline: isOffline,
      categoryId: categoryId ?? 0,
    });

    if (result?.success && result.data) {
      setCreatedContest(result.data);
    } else {
      Logger.error(result?.error);
    }
    setIsLoading(false);
  };

  const resetValues = () => {
    setSkillTag("");
    setIsChallengeOpen(false);
    setCategoryId(null);
    setStake(0);
    setCharacterValue("");
  };

  const handleRouteToContest = () => {
    if (createdContest) {
      Router.push(`/(tabs)/mainApp/}`);
    } else {
      Router.push("/(tabs)/mainApp/arena");
    }
    setCreatedContest(null);
    Router.replaceHistory("/(tabs)/mainApp");
  };

  if (createdContest) {
    return (
      <SuccessfullyCreatedContest
        onRoute={handleRouteToContest}
        contest={createdContest}
      />
    );
  }

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{
        flex: 1,
        backgroundColor: theme === false ? "#fff" : "#000",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // adjust as needed
      >
        <PageContainer backgroundColor={theme == false ? "" : "#141414"}>
          <ScrollView
            style={{
              marginBottom: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10%",
                marginTop: 30,
              }}
            >
              <View style={{ position: "absolute", top: 0, left: 12 }}>
                <TouchableOpacity
                  onPress={() => {
                    Router.back();
                  }}
                  style={{
                    paddingLeft: 3,
                    borderRadius: 9999,
                  }}
                >
                  <ChevronLeftIcon
                    size={25}
                    color={theme === false ? "#292D32" : "#fff"}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: 16, // 'text-base' → 16px
                  fontWeight: "600", // 'font-semibold'
                  color: theme == false ? "#020B12" : "#ffffff",
                }}
              >
                Create Contest
              </Text>
            </View>
            <View>
              <View style={styles.container}>
                <TouchableOpacity
                  onPress={() => {
                    setIsOffline(false);
                  }}
                  style={styles.viewBlockListButton}
                >
                  <Text style={styles.text}>Online</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsOffline(true);
                  }}
                  style={styles.blockButton}
                >
                  <Text style={styles.text}>Offline</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                backgroundColor: theme == false ? "#ffffff" : "#1D1F20",
                borderColor: theme == false ? "#E7F4FD" : "#27292B",
                width: "90%",
                borderWidth: 1,
                borderRadius: 8,
                marginLeft: "auto",
                marginRight: "auto",
                padding: 10,
                marginTop: 20,
                paddingBottom: 20,
              }}
            >
              {isOffline && (
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    paddingBottom: 15,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        textAlign: "left",
                        fontWeight: "600",
                        color: theme == false ? "#000" : "#fff",
                        paddingBottom: 5,
                      }}
                    >
                      Reminder: Document your Contest
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#8F8F8F",
                        fontWeight: "400",
                      }}
                    >
                      Make sure to take photos or videos of your contest —
                      it&apos;s the best way to prove who won and keep things
                      fair.
                    </Text>
                  </View>
                </View>
              )}
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: "left",
                      fontWeight: "600",
                      color: theme == false ? "#000" : "#fff",
                      paddingBottom: 5,
                    }}
                  >
                    Open challenge
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#8F8F8F",
                      fontWeight: "400",
                    }}
                  >
                    Time to rally the crowd! Others will get a heads-up to join
                    your contest.
                  </Text>
                  <Switch
                    value={isChallengeOpen}
                    onValueChange={() => {
                      setIsChallengeOpen((prev) => !prev);
                    }}
                    style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                  />
                </View>
              </View>
              {/* Divider */}
              <View
                style={{
                  width: 306,
                  height: 0,
                  borderTopWidth: 1,
                  borderColor: theme == false ? "#F7F7F7" : "#27292B",
                  marginTop: 10,
                  paddingBottom: 10,
                }}
              />
              {/* Conditional Rendering */}
              {!isChallengeOpen ? (
                <>
                  <Text
                    style={{
                      fontFamily: "General Sans Variable",
                      fontStyle: "normal",
                      fontWeight: "500",
                      fontSize: 14,
                      color: theme == false ? "#000" : "#fff",
                    }}
                  >
                    Opponent&apos;s skillgap tag
                  </Text>
                  <Input
                    placeholder="e.g @skillgap"
                    type="text"
                    value={setSkillTag}
                    text={skillTag}
                  />
                  {tagError && skillTag != "" ? (
                    <Text
                      style={{
                        color: "#FB5631",
                        fontSize: 11,
                        paddingLeft: 10,
                        paddingTop: 5,
                      }}
                    >
                      skilgap user with tag does not exit
                    </Text>
                  ) : null}
                </>
              ) : (
                <View>
                  <Text
                    style={{
                      width: "96%",
                      height: 21,
                      fontFamily: "General Sans Variable",
                      fontStyle: "normal",
                      fontWeight: "500",
                      fontSize: 14,
                      lineHeight: 21,
                      letterSpacing: -0.01,
                      marginLeft: "auto",
                      marginRight: "auto",
                      color: "#8F8F8F",
                    }}
                  >
                    Opponent’s skillgap tag
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 20,
                      borderColor: "#D0D5DD",
                      width: "97%",
                      height: 40,
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: 10,
                      padding: 5,
                      paddingLeft: 10,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#8F8F8F",
                      }}
                    >
                      @skillgap
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View
              style={{
                backgroundColor: theme == false ? "#ffffff" : "#1D1F20",
                borderColor: theme == false ? "#E7F4FD" : "#27292B",
                borderWidth: 1,
                borderRadius: 8,
                width: "90%",
                marginLeft: "auto",
                marginRight: "auto",
                padding: 10,
                marginTop: 20,
              }}
            >
              {!categoryId ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: theme === false ? "#F2F2F7" : "#27292B",
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                  }}
                  onPress={() => setShowCategories(!showCategories)}
                >
                  <Ionicons name="filter" size={16} color="#A3A3A3" />
                  <Text
                    style={{ color: "#A3A3A3", marginLeft: 8, fontSize: 14 }}
                  >
                    Categories
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  <View
                    style={{
                      display: "flex",
                      alignContent: "space-between",
                      flexDirection: "row",
                      paddingRight: 5,
                      paddingLeft: 5,
                    }}
                  >
                    <Text
                      style={{
                        width: "96%",
                        height: 21,
                        fontFamily: "General Sans Variable",
                        fontStyle: "normal",
                        fontWeight: "500",
                        fontSize: 14,
                        lineHeight: 21,
                        letterSpacing: -0.01,
                        flexGrow: 0,
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: 10,
                        color: theme == false ? "#000" : "#fff",
                      }}
                    >
                      Selected Categories
                    </Text>
                    <AntDesign
                      onPress={() => setShowCategories(!showCategories)}
                      name="edit"
                      size={22}
                      color="#1D9BF0"
                    />
                  </View>
                  <Text
                    style={{
                      width: "98%",
                      fontFamily: "General Sans Variable",
                      fontStyle: "normal",
                      fontWeight: "400",
                      fontSize: 10,
                      lineHeight: 15,
                      marginLeft: "auto",
                      color: "#8F8F8F",
                    }}
                  >
                    All result from your selections ranging from main to sub
                    categories
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginTop: 10,
                      flexWrap: "wrap",
                      rowGap: 10,
                      columnGap: 20,
                    }}
                  >
                    <GetColoredCategoryBubbles data={categoriesMap} />
                  </View>
                </>
              )}
            </View>

            <View
              style={{
                backgroundColor: theme == false ? "#ffffff" : "#1D1F20",
                borderColor: theme == false ? "#E7F4FD" : "#27292B",
                borderWidth: 1,
                borderRadius: 8,
                width: "90%",
                marginLeft: "auto",
                marginRight: "auto",
                padding: 10,
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  width: "96%",
                  height: 21,
                  fontFamily: "General Sans Variable",
                  fontStyle: "normal",
                  fontWeight: "500",
                  fontSize: 14,
                  lineHeight: 21,
                  letterSpacing: -0.01,
                  flexGrow: 0,
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: 10,
                  color: theme == false ? "#000" : "#fff",
                }}
              >
                Stake
              </Text>

              <TextInput
                maxLength={10}
                placeholder="e.g #10,000"
                placeholderTextColor={"#8F8F8F"}
                inputMode="numeric"
                style={{
                  borderWidth: 1,
                  borderRadius: 20,
                  borderColor: "#242628",
                  width: "99%",
                  height: 40,
                  marginLeft: "auto",
                  marginRight: "auto",
                  color: theme === false ? "#000000" : "#ffffff",
                  marginTop: 10,
                  padding: 5,
                  paddingLeft: 10,
                  fontSize: 14,
                }}
                value={`${stake}`}
                onChangeText={(value) => {
                  const cleaned = value.replace(/[^0-9]/g, "");
                  setStake(
                    Number(cleaned === "" ? null : parseInt(cleaned, 10))
                  );
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginRight: 10,
                  columnGap: 3,
                  marginTop: 5,
                }}
              >
                <Text
                  style={{
                    height: 17,
                    fontFamily: "General Sans Variable",
                    fontStyle: "italic",
                    fontWeight: "400",
                    fontSize: 11,
                    lineHeight: 16.5,
                    letterSpacing: -0.121,
                    color: "#8F8F8F",
                  }}
                >
                  Balance:
                </Text>
                <Text
                  style={{
                    height: 17,
                    fontFamily: "General Sans Variable",
                    fontStyle: "italic",
                    fontWeight: "400",
                    fontSize: 11,
                    lineHeight: 16.5,
                    color: theme == false ? "#000" : "#fff",
                  }}
                >
                  &#8358;
                  {balance.left}.{balance.right}
                </Text>
              </View>

              <Text
                style={{
                  width: "96%",
                  height: 21,
                  fontFamily: "General Sans Variable",
                  fontStyle: "normal",
                  fontWeight: "500",
                  fontSize: 14,
                  lineHeight: 21,
                  letterSpacing: -0.01,
                  flexGrow: 0,
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: 10,
                  color: theme == false ? "#000" : "#fff",
                }}
              >
                Terms and Description
              </Text>
              <TextInput
                multiline
                maxLength={maxChars}
                value={characterValue}
                onChangeText={setCharacterValue}
                placeholderTextColor="#8F8F8F"
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "98%",
                  marginTop: 10,
                  borderWidth: 1,
                  borderColor: "#27292B",
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 14,
                  color: "#8F8F8F",
                  textAlignVertical: "top",
                }}
              />

              <View
                style={{
                  width: "100%",
                  justifyContent: "flex-end",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    height: 16,
                    fontFamily: "General Sans Variable",
                    fontStyle: "normal",
                    fontWeight: "400",
                    fontSize: 10,
                    lineHeight: 16,
                    textAlignVertical: "center",
                    width: 30,
                    marginTop: 5,
                    color: "#8F8F8F",
                  }}
                >
                  {characterValue.length}/{maxChars}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                width: wp("90%"),
                height: hp("7%"),
                borderRadius: 100,
                padding: 10,
                backgroundColor: "#1D9BF0",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: "auto",
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator size={30} color={"#ffffff"} />
                ) : (
                  "Done"
                )}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <Modal
            visible={showCategories}
            transparent
            animationType="slide"
            onRequestClose={() => setShowCategories(false)}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  height: "100%",
                }}
              >
                <BlurView
                  intensity={80}
                  tint="systemMaterialDark"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableWithoutFeedback>
                    <Categories
                      onSelected={onCategorySelected}
                      close={() => setShowCategories(false)}
                    />
                  </TouchableWithoutFeedback>
                </BlurView>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </PageContainer>
      </KeyboardAvoidingView>{" "}
    </SafeAreaView>
  );
};

export default CreateContest;
