import PageContainer from "@/components/Containers";
import { useUserContext } from "@/hooks/useAppContext";
import { useTheme } from "@/hooks/useThemeContext";
import { formatDateDisplay } from "@/services/generateRandomHexNumber";
import { Media } from "@/services/media";
import { INotification, NotificationService } from "@/services/notification";
import { Router } from "@/services/router";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import NetworkImage from "../components/networkImage";
import { YouTubeSkeletonList } from "../components/skelentonLoader";

const PAGE_SIZE = 20;

async function fetchNotifications(page: number): Promise<INotification[] | []> {
  const fetchData = await NotificationService.getNotification(page);
  return fetchData;
}

async function deleteNotification(id: number) {
  return await NotificationService.deleteNotification(id);
}

const Notification = () => {
  const { theme } = useTheme();
  const dark = theme !== false; // your scheme: false = light
  const { user } = useUserContext();

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);
  const onEndReachedCalledDuringMomentum = useRef(false);
  const pageRef = useRef(1);

  useFocusEffect(
    useCallback(() => {
      Router.clearHistory();
      void loadFirstPage();
    }, [])
  );

  async function loadFirstPage() {
    setLoading(true);
    onEndReachedCalledDuringMomentum.current = false;
    pageRef.current = 1;
    setHasMore(true);
    try {
      const res = await fetchNotifications(1);
      setNotifications(res || []);
      if (!res || res.length < PAGE_SIZE) setHasMore(false);
    } catch (e) {
      console.warn("Failed to load notifications (page 1)", e);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (loading || isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const nextPage = pageRef.current + 1;
      const res = await fetchNotifications(nextPage);
      if (!res || res.length === 0) {
        setHasMore(false);
        return;
      }
      setNotifications((prev) => {
        const merged = [...prev, ...res];
        const seen = new Set<string>();

        return merged.filter((n) => {
          const time =
            (n as any).transaction?.timeStamp ??
            (n as any).contest?.timeStamp ??
            "";

          const key =
            (n as any).id != null
              ? `id:${(n as any).id}` // prefer stable id when present
              : [
                  (n as any).type ?? "",
                  (n as any).transactionId ?? "",
                  (n as any).contestId ?? "",
                  time,
                ].join("|"); // fallback composite

          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      });

      pageRef.current = nextPage;
      if (res.length < PAGE_SIZE) setHasMore(false);
    } catch (e) {
      console.warn("Failed to load more notifications", e);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }

  const renderImgComponent = (item: INotification) => {
    switch (item.type) {
      case "transactiondeposit":
        return (
          <Image
            source={
              theme === false
                ? require("../../../assets/icons/depositSuccessLight.png")
                : require("../../../assets/icons/depositSuccessDark.png")
            }
            style={{ height: 30, width: 30 }}
          />
        );
      case "transactionwithdraw":
        return (
          <Image
            source={
              theme === false
                ? require("../../../assets/icons/depositFailedLight.png")
                : require("../../../assets/icons/depositFailedDark.png")
            }
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
          />
        );
      default:
        return (
          <View
            style={{
              alignItems: "center",
              borderWidth: item.contest?.ownerId === user?.id ? 0 : 2,
              borderColor: item.contest?.owner?.isOnline
                ? "#4CD964"
                : "#EBF2FF",
              borderRadius: 100,
            }}
          >
            <NetworkImage
              loadingUri={require("../../../assets/images/profile-img.png")}
              uri={Media.GetCategoryImageUris(user?.id ?? 0).original}
              style={{ height: 30, width: 30, borderRadius: 20 }}
            />
          </View>
        );
    }
  };

  const renderItem = ({ item }: { item: INotification }) => {
    const opponentName =
      item.contest?.ownerId === user?.id
        ? item.contest?.opponent?.fullName
        : item.contest?.owner?.fullName;

    const formatAmount = (n?: number) =>
      typeof n === "number"
        ? new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(n)
        : "amount";
    return (
      <TouchableOpacity
        onPress={() => {
          deleteNotification(item.id);
          item.type === "transactiondeposit" ||
          item.type === "transactionwithdraw" ||
          item.type === "transactionwithdrawfailed"
            ? Router.push(`/mainApp/wallet?transactionId=${item.transactionId}`)
            : Router.push(
                `/(tabs)/components/contest/myContestDetails?contestId=${item.contestId}`
              );
        }}
      >
        <View
          style={{
            width: "92%",
            marginHorizontal: "auto",
            backgroundColor: theme == false ? "#ffffff" : "#1D1F20",
            borderRadius: 8,
            flexDirection: "column",
            padding: 10,
            gap: 10,
            marginBottom: 10,
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "flex-start", gap: 7 }}
          >
            {renderImgComponent(item)}
            <View>
              <View
                style={{
                  width: wp("75%"),
                  marginBottom: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* Left: header text */}
                <Text
                  numberOfLines={1}
                  style={{
                    color: theme === false ? "#000" : "#ffffff",
                    fontSize: 12,
                    fontWeight: "600",
                    flexShrink: 1,
                    maxWidth: "65%", // allow timestamp on the right
                  }}
                >
                  {item.type === "transactiondeposit"
                    ? "Deposit credited"
                    : item.type === "transactionwithdraw"
                    ? "Withdrawal completed"
                    : item.type === "transactionwithdrawfailed"
                    ? "Withdrawal failed"
                    : item.type === "contestdispute"
                    ? "Contest dispute"
                    : item.type === "contestrequest"
                    ? item.contest?.category?.name
                      ? `Contest request`
                      : "Contest request"
                    : item.type === "contestwon"
                    ? "Congratulations 🎉"
                    : item.type === "contestlost"
                    ? "Ouch "
                    : item.type === "conteststarted"
                    ? "Contest started"
                    : item.transaction != null
                    ? "Check transaction page for more details"
                    : "Notification!!"}
                </Text>

                {/* Right: timestamp */}
                <Text
                  numberOfLines={1}
                  style={{
                    color: "#9ca3af",
                    fontSize: 12,
                    marginLeft: "auto",
                  }}
                >
                  {formatDateDisplay(
                    item.transaction?.timeStamp ??
                      item.contest?.timeStamp ??
                      new Date().toISOString()
                  )}
                </Text>
              </View>

              {/* Body/description */}
              <View
                style={{ flexDirection: "row", flexWrap: "wrap", width: "70%" }}
              >
                <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                  {item.type === "transactiondeposit" ? (
                    <>
                      Your deposit of{" "}
                      <Text
                        style={{
                          color: theme === false ? "#000" : "#fff",
                          fontWeight: "600",
                        }}
                      >
                        {formatAmount(item.transaction?.amount)}
                      </Text>{" "}
                      has been credited.
                    </>
                  ) : item.type === "transactionwithdraw" ? (
                    <>
                      Your withdrawal of{" "}
                      <Text
                        style={{
                          color: theme === false ? "#000" : "#fff",
                          fontWeight: "600",
                        }}
                      >
                        {formatAmount(item.transaction?.amount)}
                      </Text>
                      &nbsp; is complete.
                    </>
                  ) : item.type === "transactionwithdrawfailed" ? (
                    <>
                      Your withdrawal of{" "}
                      <Text style={{ color: "#1D9BF0", fontWeight: "600" }}>
                        {formatAmount(item.transaction?.amount)}
                      </Text>
                      &nbsp; failed. Check the transaction receipt for more
                      details.
                    </>
                  ) : item.type === "contestdispute" ? (
                    <>
                      <Text
                        style={{
                          color: "#9ca3af",
                          fontWeight: "600",
                        }}
                      >
                        This contest has been disputed reach out to customer
                        support for more info.
                      </Text>
                    </>
                  ) : item.type === "contestrequest" ? (
                    <>
                      <Text
                        style={{
                          color: "#1D9BF0",
                          fontWeight: "600",
                        }}
                      >
                        @{item.contest?.owner?.fullName ?? "an opponent"}
                      </Text>
                      &nbsp; just challenged your skills with a prize of{" "}
                      {formatAmount(item.contest?.stake)}.
                    </>
                  ) : item.type === "contestwon" ? (
                    <>
                      You just won the contest between{" "}
                      <Text style={{ color: "#1D9BF0", fontWeight: "600" }}>
                        @{opponentName ?? "opponent"}
                      </Text>{" "}
                      &nbsp; winning prize of{" "}
                      {formatAmount(item.contest?.stake)}
                      🎉
                    </>
                  ) : item.type === "contestlost" ? (
                    <>
                      You lost a contest to{" "}
                      <Text
                        style={{
                          color: "#1D9BF0",
                          fontWeight: "800",
                          fontSize: 12,
                        }}
                      >
                        @{opponentName ?? "opponent"}&nbsp;
                      </Text>
                      loosing {formatAmount(item.contest?.stake)}.
                    </>
                  ) : item.type === "conteststarted" ? (
                    <>
                      You started a contest with&nbsp;
                      <Text
                        style={{
                          color: "#1D9BF0",
                          fontWeight: "600",
                        }}
                      >
                        @{opponentName ?? "opponent"}&nbsp;
                      </Text>
                      staking {item.contest?.stake}.
                    </>
                  ) : item.transaction != null ? (
                    <>Check transaction page for more details</>
                  ) : (
                    item.contest?.description ?? "Contest update"
                  )}
                </Text>
              </View>
            </View>
          </View>

          {item.type === "contestrequest" ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  deleteNotification(item.id);
                  Router.push(
                    `/(tabs)/components/contest/myContestDetails?contestId=${item.contestId}`
                  );
                }}
                style={{
                  width: "40%",
                  alignItems: "center",
                  paddingHorizontal: 24,
                  paddingVertical: 8,
                  borderRadius: 9999,
                  borderWidth: 2,
                  borderColor: "#1D9BF0",
                }}
              >
                <Text
                  style={{ color: "#1D9BF0", fontSize: 14, fontWeight: "500" }}
                >
                  Decline
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  deleteNotification(item.id);
                  Router.push(
                    `/(tabs)/components/contest/myContestDetails?contestId=${item.contestId}`
                  );
                }}
                style={{
                  width: "40%",
                  alignItems: "center",
                  paddingHorizontal: 24,
                  paddingVertical: 8,
                  borderRadius: 9999,
                  backgroundColor: "#3b82f6",
                }}
              >
                <Text
                  style={{ color: "#ffffff", fontSize: 14, fontWeight: "500" }}
                >
                  Accept
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <PageContainer backgroundColor={theme == false ? "" : "#141414"}>
      {/* Title */}
      <View
        style={{
          marginBottom: "10%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: theme == false ? "#020B12" : "#ffffff",
          }}
        >
          Notifications
        </Text>
      </View>

      {/* Correct loading logic */}
      {loading && notifications.length === 0 ? (
        <YouTubeSkeletonList
          count={7}
          width={"100%"}
          height={100}
          dark={dark}
          contentContainerStyle={{
            marginTop: 10,
            gap: 10,
            marginHorizontal: "auto",
            width: "90%",
          }}
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) =>
            String(
              (item as any).id ??
                `${item.transactionId ?? ""}-${item.contestId ?? ""}-${item.id}`
            )
          }
          renderItem={renderItem}
          ListFooterComponent={
            loading && notifications.length > 0 ? (
              <ActivityIndicator size="small" />
            ) : hasMore ? null : null
          }
          ListEmptyComponent={
            !loading ? (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 16,
                  color: theme ? "#fff" : "#000",
                  opacity: 0.6,
                }}
              >
                No notifications yet
              </Text>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 10 }}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum.current) {
              void loadMore();
              onEndReachedCalledDuringMomentum.current = true;
            }
          }}
          onEndReachedThreshold={0.2}
        />
      )}
    </PageContainer>
  );
};

export default Notification;
