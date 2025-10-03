import PageContainer from "@/components/Containers";
import { useUserContext } from "@/hooks/useAppContext";
import { useTheme } from "@/hooks/useThemeContext";
import { Contest, IContest } from "@/services/contest";
import { formatNumber } from "@/services/formValidation";
import { convertUTCToNormalDate } from "@/services/generateRandomHexNumber";
import { Logger } from "@/services/logger";
import { Media } from "@/services/media";
import { Router } from "@/services/router";
import { SessionUser } from "@/services/user";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import WarningModal from "../modals";
import NetworkImage from "../networkImage";
import NotEnoughCash from "../notEnoughCash";
import { YouTubeSkeletonList } from "../skelentonLoader"; // <-- import skeleton
import SuccessfullyJoinedContest from "./successfullyJoinedContest";
import WhoWonModal from "./whowonModal";

type ContestStage = "View" | "OwnerEdit" | "Ongoing" | "Join";

const MyContestDetails = () => {
  const { user } = useUserContext();
  const { theme } = useTheme();

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectWhoWon, setSelectWhoWon] = useState(false);
  const [showNoMoney, setShowNoMoney] = useState(false);
  const [showJoinedMessage, setShowJoinedMessage] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const [contest, setContest] = useState<IContest | null>(null);
  const [contestStage, setContestStage] = useState<ContestStage>("Join");

  const [loadingContest, setLoadingContest] = useState(true); // <-- page-load flag

  const { contestId } = useLocalSearchParams();

  useFocusEffect(
    useCallback(() => {
      setShowNoMoney(false);
      setSelectWhoWon(false);
      setShowDisputeModal(false);
      setShowWarningModal(false);
      setShowJoinedMessage(false);

      if (contestId) {
        setLoadingContest(true); // <-- start loader
        setContest(null); // <-- ensure clean state for skeleton
        Contest.getContest(Number(contestId))
          .then((response) => {
            if (response) {
              setContest(response);
              setStage(response);
            } else {
              Router.back();
            }
          })
          .catch(() => {
            Router.back();
          })
          .finally(() => setLoadingContest(false)); // <-- stop loader
      } else {
        Router.back();
      }
    }, [contestId])
  );

  useEffect(() => {
    setJoinLoading(false);
  }, []);

  const setStage = (contest: IContest) => {
    let stage: ContestStage = "View";

    switch (contest.state) {
      case "pending":
        stage =
          contest.ownerId === SessionUser?.id
            ? "OwnerEdit"
            : contest.opponent?.id === SessionUser?.id || contest.isOpen
            ? "Join"
            : stage;
        break;

      case "ongoing":
        stage = [contest.ownerId, contest.opponent?.id ?? 0].includes(
          SessionUser?.id ?? -1
        )
          ? "Ongoing"
          : stage;
    }

    setContestStage(stage);
  };

  const menuView = () => {
    switch (contestStage) {
      case "View":
        return <></>;

      case "OwnerEdit":
        return (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                width: "80%",
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
              onPress={() => setShowWarningModal(true)}
            >
              <Text style={{ color: "#ffffff", fontSize: 16 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        );

      case "Ongoing":
        return (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => setShowDisputeModal(true)}
              style={{
                width: "30%",
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
              <Text
                style={{
                  color: theme == false ? "#000" : "#ffffff",
                  fontSize: 16,
                }}
              >
                Dispute
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectWhoWon(true)}
              style={{
                width: "50%",
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
              <Text style={{ color: "#ffffff", fontSize: 16 }}>Who won?</Text>
            </TouchableOpacity>
          </View>
        );

      case "Join":
        return (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={joinContest}
              style={{
                width: "80%",
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
              {joinLoading ? (
                <ActivityIndicator size={30} color="#ffffff" />
              ) : (
                <Text style={{ color: "#ffffff", fontSize: 16 }}> Join</Text>
              )}
            </TouchableOpacity>
          </View>
        );
    }
  };

  const navigateBack = () => {
    Router.back();
  };

  const deleteContest = () => {
    if (contestId) {
      Contest.deleteContest(Number(contestId))
        .then((response) => {
          if (response) {
            Router.back();
          }
        })
        .finally(() => {
          setShowWarningModal(false);
        });
    }
  };

  const joinContest = () => {
    if (joinLoading || !contest) return;

    if (contest.stake > (SessionUser?.balance ?? 0)) {
      setShowNoMoney(true);
      return;
    }

    setJoinLoading(true);
    Contest.joinContest(Number(contestId))
      .then((response) => {
        if (response) {
          setContest({ ...contest, state: "ongoing", opponent: SessionUser });
          setShowJoinedMessage(true);
        }
      })
      .catch((err) => {
        Logger.error(err);
      })
      .finally(() => {
        setJoinLoading(false);
      });
  };

  const disputeContest = () => {
    if (contest) {
      Contest.disputeContest(Number(contestId)).then((response) => {
        if (response) {
          setContest({ ...contest, state: "disputed" });
          Router.back();
        }
      });
    }
  };

  const selectWinner = (userId: number) => {
    if (!contest) return;

    Contest.selectContestWinner(contest.id, userId).then((response) => {
      if (response) {
        const winnerId = response.winnerId;
        if (!winnerId) {
          Router.push("/components/contest/waitingForResults");
          return;
        }

        const route =
          winnerId === user?.id
            ? `/components/contest/winnerCard?tagName=${SessionUser?.tag}&opponentTagName=${contest.opponent?.tag}&stake=${contest.stake}`
            : `/components/contest/lostCard?opponentTagName=${contest.opponent?.tag}&stake=${contest.stake}`;
        Router.push(route);
      }
    });
  };

  const getContestReward = () => {
    if (!contest) return 0;
    const rewardChunk = (100 - (contest?.fee ?? 0)) / 100;
    return rewardChunk * contest.stake * 2;
  };

  if (showJoinedMessage && contest) {
    return (
      <SuccessfullyJoinedContest onRoute={navigateBack} contest={contest} />
    );
  }

  return (
    <PageContainer
      paddingBottom="0"
      backgroundColor={theme == false ? "#FAFAFA" : "#141414"}
    >
      <>
        <ScrollView>
          {/* ---------- SKELETON WHILE LOADING ---------- */}
          {loadingContest || !contest ? (
            <YouTubeSkeletonList
              count={1}
              width={"100%"}
              height={500}
              dark={theme ?? false}
              contentContainerStyle={{
                marginTop: 10,
                gap: 10,
                marginHorizontal: "auto",
                width: "98%",
              }}
            />
          ) : (
            <>
              <View style={{ justifyContent: "center" }}>
                <View style={{ left: 8 }}>
                  <TouchableOpacity
                    onPress={navigateBack}
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
                <NetworkImage
                  loadingUri={require("../../../../assets/images/icon.png")}
                  uri={Media.GetCategoryImageUris(contest.category.id).original}
                  style={{ height: 140, width: "100%" }}
                />
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
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 16,
                      color: "#1D9BF0",
                      fontWeight: "700",
                      maxWidth: 150,
                    }}
                  >
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
                      {`${contest.state}`}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    backgroundColor: theme == false ? "#ffffff" : "#1D1F20",
                    paddingVertical: 16,
                    borderRadius: 12,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: theme == false ? "#ffffff" : "#27292B",
                      paddingHorizontal: 20,
                      paddingVertical: 15,
                      borderRadius: 10,
                      alignItems: "center",
                      width: 125,
                    }}
                  >
                    <View style={{ padding: 8, borderRadius: 9999 }}>
                      <View
                        style={{
                          alignItems: "center",
                          borderWidth: contest.owner?.id === user?.id ? 0 : 2,
                          borderColor: contest.owner?.isOnline
                            ? "#4CD964"
                            : "#EBF2FF",
                          borderRadius: 100,
                        }}
                      >
                        <NetworkImage
                          loadingUri={require("../../../../assets/images/profile-img.png")}
                          uri={
                            Media.GetProfileImageUris(contest.owner.id).original
                          }
                          style={{ width: 50, height: 50, borderRadius: 9999 }}
                        />
                      </View>
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: "#3B82F6",
                        fontSize: 16,
                        fontWeight: "600",
                        maxWidth: 90,
                      }}
                    >
                      @{contest.owner.tag}
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
                        &#8358;{formatNumber(contest.stake)}
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
                      paddingHorizontal: 20,
                      paddingVertical: 15,
                      borderRadius: 10,
                      alignItems: "center",
                      width: 125,
                    }}
                  >
                    <View style={{ padding: 8, borderRadius: 9999 }}>
                      <View
                        style={{
                          alignItems: "center",
                          borderWidth:
                            contest.opponent?.id === user?.id ? 0 : 2,
                          borderColor: contest.opponent?.isOnline
                            ? "#4CD964"
                            : "#EBF2FF",
                          borderRadius: 100,
                        }}
                      >
                        <NetworkImage
                          loadingUri={
                            contest.opponent === null
                              ? require("../../../../assets/images/unknownAvatar.png")
                              : require("../../../../assets/images/profile-img.png")
                          }
                          uri={
                            Media.GetProfileImageUris(contest.opponent?.id ?? 0)
                              .original
                          }
                          style={{ width: 50, height: 50, borderRadius: 9999 }}
                        />
                      </View>
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: "#3B82F6",
                        fontSize: 16,
                        fontWeight: "600",
                        maxWidth: 90,
                      }}
                    >
                      {contest.opponent ? `@${contest.opponent.tag}` : "?"}
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
                        &#8358;{formatNumber(contest.stake)}
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
                  {contest.description}
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
                    { label: "Created by:", value: `@${contest.owner.tag}` },
                    {
                      label: "Date & Time:",
                      value: `${convertUTCToNormalDate(
                        contest.timeStamp ?? ""
                      )}`,
                    },
                    { label: "Contest ID:", value: `${contest.id}` },
                    { label: "Prize:", value: `₦${getContestReward()}` },
                    {
                      label: "SkillGap Fee:",
                      value: `${contest.fee?.toFixed(2) ?? 0}%`,
                    },
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
                        numberOfLines={1}
                        style={{
                          color:
                            item.label === "Created by:"
                              ? "#3B82F6"
                              : "#9CA3AF",
                          fontSize: 14,
                          maxWidth: 200,
                          textAlign: "right",
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
                  We advise you keep all records and evidence during this
                  contest for dispute resolution{" "}
                  <Text
                    style={{
                      fontWeight: "bold",
                      textDecorationLine: "underline",
                    }}
                    onPress={() => {
                      Linking.openURL("https://skillgap.co");
                    }}
                  >
                    {" "}
                    Learn More
                  </Text>
                </Text>
              </View>

              {menuView()}
            </>
          )}
        </ScrollView>

        {showWarningModal ? (
          <WarningModal
            proceed={deleteContest}
            cancel={() => {
              setShowWarningModal(false);
            }}
            text="Are you sure you want to delete this contest?"
          />
        ) : null}

        {showDisputeModal ? (
          <WarningModal
            proceed={disputeContest}
            cancel={() => {
              setShowDisputeModal(false);
            }}
            text="Are you sure you want to dispute this contest?"
          />
        ) : null}

        {showNoMoney && <NotEnoughCash close={() => setShowNoMoney(false)} />}

        {selectWhoWon ? (
          <WhoWonModal
            contest={contest}
            confirmed={selectWinner}
            close={() => setSelectWhoWon(false)}
          />
        ) : null}
      </>
    </PageContainer>
  );
};

export default MyContestDetails;
