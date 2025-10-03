import PageContainer from "@/components/Containers";
import { useUserContext } from "@/hooks/useAppContext";
import { useTheme } from "@/hooks/useThemeContext";
import { getSignedAmount } from "@/services/formValidation";
import { formatDateDisplay } from "@/services/generateRandomHexNumber";
import { Router } from "@/services/router";
import {
  ITransaction,
  Transaction,
  TransactionType,
} from "@/services/transaction";
import { formatMoney } from "@/utitlity/string";
import { BlurView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { YouTubeSkeletonList } from "../components/skelentonLoader";
import { Nodata } from "../mainApp";

const Wallet = () => {
  const { theme } = useTheme();
  const { user } = useUserContext();

  const [active, setActive] = useState<TransactionType | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[] | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const money = formatMoney(user?.balance ?? 0);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>();
  const amountResult = getSignedAmount(selectedTransaction?.amount ?? 0);
  const { transactionId } = useLocalSearchParams();
  const [isTransactionIdState, setIsTransactionIdState] = useState<any>(null);

  const [loading, setLoading] = useState(false); // list loading
  const [detailsLoading, setDetailsLoading] = useState(false); // receipt details loading
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);
  const onEndReachedCalledDuringMomentum = useRef(false);
  const pageRef = useRef(1);

  useEffect(() => {
    Router.clearHistory();
    setActive(null);
  }, []);

  /**
   * Effect A: Load the list (depends ONLY on `active`)
   */
  useEffect(() => {
    let alive = true;

    // reset paging on filter change
    pageRef.current = 1;
    setHasMore(true);
    setLoading(true);
    onEndReachedCalledDuringMomentum.current = false;

    // load page 1
    Transaction.getTransactions(1, active)
      .then((res) => {
        if (!alive) return;
        setTransactions(res || []);
        if (!res || res.length === 0) setHasMore(false);
      })
      .catch((e) => {
        console.warn("Failed to load transactions (page 1)", e);
        if (alive) {
          setTransactions([]);
          setHasMore(false);
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [active]);

  /**
   * Effect B: Handle deep-link / param-based receipt (depends ONLY on `transactionId`)
   */
  useEffect(() => {
    let alive = true;

    setIsTransactionIdState(transactionId ?? null);

    if (transactionId) {
      setSelectedTransaction(null);
      setDetailsLoading(true);
      Transaction.getTransactionDetails(String(transactionId))
        .then((res) => {
          if (alive) setSelectedTransaction(res);
        })
        .catch((e) => console.warn("Failed to load tx details", e))
        .finally(() => {
          if (alive) setDetailsLoading(false);
        });
    } else {
      setSelectedTransaction(null);
    }

    return () => {
      alive = false;
    };
  }, [transactionId]);

  // load more (kept name as requested)
  async function getMyContestList() {
    if (loading || isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setLoading(true);
    try {
      const nextPage = pageRef.current + 1;
      const res = await Transaction.getTransactions(nextPage, active);

      if (!res || res.length === 0) {
        setHasMore(false);
        return;
      }

      setTransactions((prev) => {
        const base = Array.isArray(prev) ? prev : [];
        const merged = [...base, ...res];

        // de-dupe by id (fallback to ref+timestamp)
        const seen = new Set<string | number>();
        return merged.filter((x: any) => {
          const key = x?.id ?? `${x?.paymentReference}-${x?.timeStamp}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      });

      pageRef.current = nextPage;
    } catch (e) {
      console.warn("Failed to load more transactions", e);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }

  const getBackgroundColor = (buttonName: string) => {
    const isActive = active === buttonName;
    if (theme === false) {
      return isActive ? "#B3E5FC" : "#E7F4FD";
    } else {
      return isActive ? "#1A1D1F" : "#313335";
    }
  };
  const getTextColor = () => "#1D9BF0";

  const darkStateImg =
    selectedTransaction?.state === "successful" ? (
      <Image source={require("../../../assets/icons/successDark.png")} />
    ) : selectedTransaction?.state === "failed" ? (
      <Image source={require("../../../assets/icons/failedDark.png")} />
    ) : (
      <Image source={require("../../../assets/icons/pendingDark.png")} />
    );
  const lightStateImg =
    selectedTransaction?.state === "successful" ? (
      <Image source={require("../../../assets/icons/successLight.png")} />
    ) : selectedTransaction?.state === "failed" ? (
      <Image source={require("../../../assets/icons/failedLight.png")} />
    ) : (
      <Image source={require("../../../assets/icons/pendingLight.png")} />
    );
  const stateColor =
    selectedTransaction?.state === "successful"
      ? "#2A9D0D"
      : selectedTransaction?.state === "failed"
      ? "#FB5631"
      : "#DBBC1C";
  const selectedHeader =
    selectedTransaction?.state === "successful"
      ? "has been successfully processed."
      : selectedTransaction?.state === "failed"
      ? "failed to process."
      : "is currently pending.";

  const firstSentence =
    selectedTransaction?.type === "withdrawal"
      ? `Withdrawal to ${selectedTransaction.bankName} - ${selectedTransaction.accountName}`
      : selectedTransaction?.type === "deposit"
      ? `Deposit ${
          selectedTransaction.bankName
            ? `via ${selectedTransaction.bankName}`
            : ""
        } 
`
      : Number(selectedTransaction?.amount) < 0
      ? "You started  a contest"
      : "You won a contest";

  const renderItem = ({ item }: { item: ITransaction }) => {
    const header = item.type === "withdrawal" ? item.bankName : item.type;
    const subHeader =
      item.type === "withdrawal"
        ? item.accountName
        : item.type === "deposit"
        ? item.bankName
        : item.amount < 0
        ? "Started a contest"
        : "Won a contest";

    const formattedAmount = getSignedAmount(item.amount);
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedTransaction(item);
          setShowReceipt(true);
        }}
        style={{ marginBottom: 15, width: "95%", margin: "auto" }}
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
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
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: theme === false ? "#000" : "#fff",
                      fontSize: 12,
                      width: 175,
                      textTransform: "capitalize",
                    }}
                  >
                    {header}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#8F8F8F",
                      fontSize: 9,
                      maxWidth: 110,
                      fontWeight: 300,
                    }}
                  >
                    {subHeader}
                  </Text>
                </View>
              </View>

              <Text
                numberOfLines={1}
                style={{ color: "#6B7280", fontSize: 14, maxWidth: 160 }}
              >
                {formatDateDisplay(item.timeStamp ?? "")}
              </Text>
            </View>
          </View>

          {/* Right: Amount + Status */}
          <View style={{ alignItems: "flex-end" }}>
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
              {formattedAmount.sign}₦{formattedAmount.amount}
            </Text>
            <View
              style={{
                paddingHorizontal: 7,
                paddingVertical: 3,
                borderRadius: 100,
                backgroundColor:
                  theme === false
                    ? item.state === "successful"
                      ? "#E2FEE6"
                      : item.state === "pending"
                      ? "#FDFAED"
                      : "#FFEEEB"
                    : "#27292B",
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
                  fontWeight: "500",
                  fontSize: 14,
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
        />
      </TouchableOpacity>
    );
  };

  const dark = theme !== false;

  return (
    <PageContainer backgroundColor={theme === false ? "#FAFAFA" : "#141414"}>
      <View style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: theme === false ? "#020B12" : "#ffffff",
              fontWeight: "500",
            }}
          >
            Wallet Balance
          </Text>

          <CountryPicker withFlag countryCode={"NG"} />
        </View>
        <Text
          numberOfLines={2}
          style={{
            color: theme === false ? "#020B12" : "#ffffff",
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          &#8358;{money.left}.{money.right}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* Contest Button */}
          <TouchableOpacity
            onPress={() => setActive("contest")}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 8,
              marginHorizontal: 4,
              borderRadius: 40,
              backgroundColor: getBackgroundColor("contest"),
              gap: 4,
            }}
          >
            <Text style={{ color: getTextColor(), fontWeight: "500" }}>
              Contest
            </Text>
          </TouchableOpacity>

          {/* Withdraw Button */}
          <TouchableOpacity
            onPress={() => setActive("withdrawal")}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 8,
              marginHorizontal: 4,
              borderRadius: 40,
              backgroundColor: getBackgroundColor("withdrawal"),
              gap: 4,
            }}
          >
            <Text style={{ color: getTextColor(), fontWeight: "500" }}>
              Withdraw
            </Text>
            <Image
              source={require("../../../assets/icons/transfer-icon.png")}
              style={{ width: 10, height: 10 }}
            />
          </TouchableOpacity>

          {/* Deposit Button */}
          <TouchableOpacity
            onPress={() => setActive("deposit")}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 8,
              marginHorizontal: 4,
              borderRadius: 40,
              backgroundColor: getBackgroundColor("deposit"),
              gap: 4,
            }}
          >
            <Text style={{ color: getTextColor(), fontWeight: "500" }}>
              Deposit
            </Text>
            <Image
              source={require("../../../assets/icons/withdraw.png")}
              style={{ width: 10, height: 10 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {active ? (
        <View
          style={{ paddingVertical: 13, alignItems: "flex-end", width: "95%" }}
        >
          <TouchableOpacity onPress={() => setActive(null)}>
            <Text style={{ fontSize: 14, fontWeight: 500, color: "#1D9BF0" }}>
              See all
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* LOADING / LIST / FALLBACK */}
      {loading && (!transactions || transactions.length === 0) ? (
        <View
          style={{
            borderWidth: 1,
            width: "90%",
            margin: "auto",
            borderRadius: 10,
            borderColor: theme === false ? "#E7F4FD" : "#27292B",
            backgroundColor: theme === false ? "#FFFFFF" : "#1D1F20",
            paddingVertical: 13,
            marginBottom: "100%",
          }}
        >
          <YouTubeSkeletonList
            count={7}
            width={"100%"}
            height={100}
            dark={dark}
            contentContainerStyle={{
              marginTop: 10,
              gap: 10,
              marginHorizontal: "auto",
              width: "98%",
            }}
          />
        </View>
      ) : transactions ? (
        <View
          style={{
            borderWidth: 1,
            width: "90%",
            margin: "auto",
            borderRadius: 10,
            borderColor: theme === false ? "#E7F4FD" : "#27292B",
            backgroundColor: theme === false ? "#FFFFFF" : "#1D1F20",
            paddingVertical: 13,
            marginBottom: "100%",
          }}
        >
          <FlatList
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            data={transactions}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            onEndReached={() => {
              if (!onEndReachedCalledDuringMomentum.current) {
                getMyContestList();
                onEndReachedCalledDuringMomentum.current = true;
              }
            }}
            onEndReachedThreshold={0.2}
            ListEmptyComponent={
              !loading ? (
                <View
                  style={{
                    height: hp("28%"),
                    backgroundColor: theme ? "#27292B" : "#FFFFFF",
                  }}
                >
                  <Nodata />
                </View>
              ) : null
            }
            ListFooterComponent={
              loading && transactions.length > 0 ? (
                <ActivityIndicator size="small" />
              ) : hasMore ? null : (
                <Text
                  style={{
                    textAlign: "center",
                    padding: 12,
                    opacity: 0.6,
                    color: theme ? "#fff" : "#000",
                  }}
                >
                  No more data
                </Text>
              )
            }
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </View>
      ) : (
        // rare: not loading and transactions is still null (error or first mount)
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            marginTop: 100,
          }}
        >
          <Text
            style={{
              fontWeight: "600",
              fontSize: 16,
              marginBottom: 1,
              color: theme ? "#fff" : "#000",
            }}
          >
            Oops!
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#8F8F8F",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            You don’t have any{" "}
            {[null, "contest"].includes(active) ? "transactions" : `${active}s`}
          </Text>
        </View>
      )}

      {/* RECEIPT MODAL */}
      <Modal
        visible={showReceipt || isTransactionIdState != null}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowReceipt(false);
          setIsTransactionIdState(null);
          setSelectedTransaction(null);
        }}
      >
        <TouchableWithoutFeedback>
          <View style={{ height: "100%" }}>
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
                <View
                  style={{
                    position: "absolute",
                    width: "100%",
                    bottom: 0,
                    backgroundColor: !theme ? "#FAFAFA" : "#141414",
                  }}
                >
                  <View
                    style={{
                      height: 60,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      justifyContent: "center",
                      backgroundColor: !theme ? "#F8F8F8" : "#1D1F20",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "60%",
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            setShowReceipt(false);
                            setIsTransactionIdState(null);
                            setSelectedTransaction(null);
                          }}
                          style={{
                            width: 0,
                            borderRadius: 9999,
                            paddingLeft: 10,
                          }}
                        >
                          <ChevronLeftIcon
                            size={25}
                            color={!theme ? "#292D32" : "#ffffff"}
                          />
                        </TouchableOpacity>
                      </View>

                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: `${!theme ? "#000000" : "#ffffff"}`,
                        }}
                      >
                        Payment Receipt
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      marginTop: "8%",
                      width: "90%",
                      margin: "auto",
                      position: "relative",
                      height: 500,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor:
                          theme === false ? "#FFFFFF" : "#1D1F20",
                        width: "95%",
                        margin: "auto",
                        position: "relative",
                        paddingBottom: 30,
                        borderRadius: 15,
                      }}
                    >
                      <View
                        style={{
                          position: "absolute",
                          bottom: "97%",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        {theme === false ? lightStateImg : darkStateImg}
                      </View>

                      {/* Intro / status line with loading guard */}
                      <View
                        style={{
                          width: "90%",
                          marginHorizontal: "auto",
                          marginTop: 100,
                        }}
                      >
                        {isTransactionIdState &&
                        detailsLoading &&
                        !selectedTransaction ? (
                          <View
                            style={{ alignItems: "center", paddingVertical: 8 }}
                          >
                            <ActivityIndicator />
                            <Text
                              style={{
                                color: "#8F8F8F",
                                fontSize: 12,
                                marginTop: 8,
                              }}
                            >
                              Fetching receipt…
                            </Text>
                          </View>
                        ) : (
                          <Text
                            style={{
                              color: "#8F8F8F",
                              textAlign: "center",
                              fontSize: 14,
                              fontWeight: "600",
                            }}
                          >
                            {selectedTransaction
                              ? firstSentence
                              : selectedHeader}
                          </Text>
                        )}
                      </View>

                      <View
                        style={{
                          borderTopWidth: 1,
                          borderTopColor: "#4B5563",
                          borderStyle: "dashed",
                          marginTop: 24,
                        }}
                      />

                      <View style={{ width: "90%", marginHorizontal: "auto" }}>
                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontSize: 16,
                            fontWeight: "600",
                            marginBottom: 12,
                            paddingTop: 20,
                          }}
                        >
                          Transaction Details
                        </Text>

                        {detailsLoading && !selectedTransaction ? (
                          <View style={{ paddingVertical: 8 }}>
                            <ActivityIndicator />
                          </View>
                        ) : (
                          <View style={{ marginTop: 12 }}>
                            {[
                              {
                                label: "Type",
                                value: `${selectedTransaction?.type}`,
                              },
                              {
                                label: "Reference",
                                value: `${
                                  selectedTransaction?.paymentReference ?? ""
                                }`,
                              },
                              {
                                label: "Date",
                                value: `${formatDateDisplay(
                                  selectedTransaction?.timeStamp ?? Date()
                                )}`,
                              },
                              {
                                label: "Status",
                                value: `${selectedTransaction?.state}`,
                              },
                              {
                                label: "Amount",
                                value: `${amountResult.sign}₦${amountResult.amount}`,
                              },
                            ].map((item, index) => {
                              if (!item.value) return <></>;
                              return (
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
                                      color:
                                        theme == false ? "#020B12" : "#ffffff",
                                      fontSize: 14,
                                    }}
                                  >
                                    {item.label}
                                  </Text>
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      textTransform: "capitalize",
                                      color:
                                        item.label === "Amount"
                                          ? Number(
                                              String(item.value)
                                                .replace(/[^0-9.-]/g, "")
                                                .trim()
                                            ) > 0
                                            ? "#2A9D0D"
                                            : "#FB5631"
                                          : item.label === "Payment Status"
                                          ? `${stateColor}`
                                          : "#9CA3AF",
                                      fontSize: 14,
                                      textAlign: "right",
                                    }}
                                  >
                                    {item.value}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </BlurView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </PageContainer>
  );
};

export default Wallet;
