import PageContainer from "@/components/Containers";
import { useUserContext } from "@/hooks/useAppContext";
import { useTheme } from "@/hooks/useThemeContext";
import { Contest, IContest, IContestCategory } from "@/services/contest";
import { formatNumber } from "@/services/formValidation";
import { Media } from "@/services/media";
import { Router } from "@/services/router";
import { User } from "@/services/user";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Nodata } from ".";
import Categories from "../components/categories";
import { ContestListItem } from "../components/contest/contestListItem";
import NetworkImage from "../components/networkImage";
import {
  YouTubeSkeletonCard,
  YouTubeSkeletonList,
} from "../components/skelentonLoader";

const PAGE_SIZE = 20; // align with your backend page size

const Arena = () => {
  const { theme } = useTheme();
  const { user } = useUserContext();

  const [showCategories, setShowCategories] = useState(false);
  const [loadingMain, setLoadingMain] = useState(false); // <-- main list loading
  const [loadingHighest, setLoadingHighest] = useState(false); // <-- highest strip loading
  const [refreshing, setRefreshing] = useState(false);

  const [contests, setContests] = useState<IContest[]>([]);
  const [highestContests, setHighestContests] = useState<IContest[]>([]);

  const [id, setId] = useState<number | null>(null);
  const { categoryId, categoryName } = useLocalSearchParams();
  const [displayedCategory, setDisplayedCategory] = useState("");

  // paging guards
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);
  const onEndReachedCalledDuringMomentum = useRef(false);

  // INIT & param updates
  useEffect(() => {
    Router.clearHistory();
    if (categoryId) setId(Number(categoryId));
    if (categoryName && typeof categoryName === "string") {
      setDisplayedCategory(categoryName ?? "Categories");
    }
  }, [categoryId, categoryName]);

  useEffect(() => {
    // reset and fetch when category changes
    resetAndLoad();
    fetchHighestStakeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const resetAndLoad = async () => {
    pageRef.current = 1;
    hasMoreRef.current = true;
    onEndReachedCalledDuringMomentum.current = false;
    setLoadingMain(true);
    try {
      const first = await Contest.getOpenContests(1, id);
      setContests(first || []);
      if (!first || first.length < PAGE_SIZE) {
        hasMoreRef.current = false;
      }
    } catch (e) {
      console.warn("Failed to load contests (page 1)", e);
      hasMoreRef.current = false;
      setContests([]);
    } finally {
      setLoadingMain(false);
    }
  };

  const fetchMore = async () => {
    if (loadingMain || isFetchingRef.current || !hasMoreRef.current) return;

    isFetchingRef.current = true;
    setLoadingMain(true);
    try {
      const nextPage = pageRef.current + 1;
      const data = await Contest.getOpenContests(nextPage, id);
      if (!data || data.length === 0) {
        hasMoreRef.current = false;
        return;
      }
      setContests((prev) => {
        const merged = [...prev, ...data];
        // de-dupe by id
        const seen = new Set<number | string>();
        return merged.filter((c) => {
          const key = c.id as number | string;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      });
      pageRef.current = nextPage;
      if (data.length < PAGE_SIZE) hasMoreRef.current = false;
    } catch (e) {
      console.warn("Failed to load more contests", e);
    } finally {
      setLoadingMain(false);
      isFetchingRef.current = false;
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await User.Load();
      await resetAndLoad();
      await fetchHighestStakeData();
    } finally {
      setRefreshing(false);
    }
  };

  const fetchHighestStakeData = async () => {
    setLoadingHighest(true);
    try {
      const data = await Contest.getHighestStakeContests(id);
      setHighestContests(data || []);
    } catch (e) {
      console.warn("Failed to load highest stake contests", e);
      setHighestContests([]);
    } finally {
      setLoadingHighest(false);
    }
  };

  const onCategorySelected = (categories: IContestCategory[]) => {
    setShowCategories(false);
    if (categories && categories.length) {
      const category = categories[categories.length - 1];
      setId(category?.id ?? null);
      setDisplayedCategory(category?.name ?? "");
    }
  };

  const highestStakeContest = ({ item }: { item: IContest }) => (
    <TouchableOpacity
      style={{
        backgroundColor: theme == false ? "#ffffff" : "#27292B",
        marginRight: 5,
        padding: 2,
        width: 160,
        borderRadius: 3,
      }}
      onPress={() => {
        Router.push(
          `/(tabs)/components/contest/myContestDetails?contestId=${item.id}`
        );
      }}
    >
      <NetworkImage
        loadingUri={require("../../../assets/images/icon.png")}
        uri={Media.GetCategoryImageUris(item.id)?.original}
        style={{
          width: "100%",
          height: 165,
          borderRadius: 5,
        }}
      />

      <Text
        numberOfLines={1}
        style={{
          fontSize: 12,
          fontWeight: "600",
          marginTop: 1,
          color: theme === false ? "#000000" : "#ffffff",
          width: "90%",
          paddingLeft: 5,
        }}
      >
        {item.category.name}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 3,
            width: "75%",
          }}
        >
          <View
            style={{
              alignItems: "center",
              borderWidth: item.owner?.id === user?.id ? 0 : 2,
              borderColor: item.owner?.isOnline ? "#4CD964" : "#EBF2FF",
              borderRadius: 100,
            }}
          >
            <NetworkImage
              uri={Media.GetProfileImageUris(item.owner.id ?? 0).small}
              loadingUri={require("../../../assets/images/profile-img.png")}
              style={{
                width: 35,
                height: 35,
                borderRadius: 20,
              }}
            />
          </View>
          <View style={{ flexDirection: "column", width: "100%" }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                color: theme === false ? "#000000" : "#ffffff",
                maxWidth: "100%",
                fontWeight: "700",
              }}
            >
              @{item.owner.tag}
            </Text>

            <Text
              numberOfLines={1}
              style={{
                color: "#8F8F8F",
                fontWeight: "600",
                fontSize: 12,
                width: "100%",
              }}
            >
              Stake: &#8358;{formatNumber(item.stake)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContestListItem = ({ item }: { item: IContest }) => (
    <ContestListItem contest={item} />
  );

  const dark = theme !== false;

  return (
    <PageContainer
      paddingBottom="0"
      backgroundColor={theme == false ? "#FAFAFA" : "#141414"}
    >
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: theme == false ? "#020B12" : "#ffffff",
            }}
          >
            Arena
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: theme == false ? "#F2F2F7" : "#27292B",
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              width: wp("90%"),
              margin: "auto",
              justifyContent: "space-between",
            }}
            onPress={() => setShowCategories(!showCategories)}
          >
            <View style={{ flexDirection: "row" }}>
              <Ionicons name="filter" size={16} color="#A3A3A3" />
              <Text style={{ color: "#A3A3A3", marginLeft: 8, fontSize: 14 }}>
                {displayedCategory === "" ? "Categories" : displayedCategory}
              </Text>
            </View>
            {displayedCategory === "" ? null : (
              <TouchableOpacity
                onPress={() => {
                  setId(null);
                  setDisplayedCategory("");
                }}
              >
                <XMarkIcon width="30" height="20" color="#A3A3A3" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        {/* Highest Stake section: show heading if loading OR has data */}
        {(loadingHighest || highestContests.length > 0) && (
          <View>
            <Text
              style={{
                width: 171,
                height: 24,
                fontFamily: "General Sans Variable",
                fontStyle: "normal",
                fontWeight: "700",
                fontSize: 16,
                lineHeight: 24,
                letterSpacing: -0.16,
                color: theme == false ? "#020B12" : "#ffffff",
                paddingLeft: 10,
                marginBottom: 10,
                marginTop: 15,
              }}
            >
              Highest Stake Contest
            </Text>

            <View style={{ marginLeft: 10 }}>
              {loadingHighest ? (
                <View
                  style={{ flexDirection: "row", paddingBottom: 10, gap: 10 }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <YouTubeSkeletonCard
                      key={`hs-skel-${i}`}
                      dark={dark}
                      width={150}
                      height={200}
                      radius={5}
                      containerStyle={{ marginRight: 10 }}
                    />
                  ))}
                </View>
              ) : highestContests.length > 0 ? (
                <FlatList
                  horizontal
                  data={highestContests}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={highestStakeContest}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 10 }}
                />
              ) : null}
            </View>
          </View>
        )}
      </View>

      <View>
        <Text
          style={{
            width: 171,
            height: 24,
            fontFamily: "General Sans Variable",
            fontStyle: "normal",
            fontWeight: "700",
            fontSize: 16,
            lineHeight: 24,
            letterSpacing: -0.16,
            color: theme === false ? "#020B12" : "#ffffff",
            paddingLeft: 10,
            marginBottom: 10,
            marginTop: 15,
          }}
        >
          Available Contest
        </Text>
      </View>

      {/* Main list: show skeleton on first load; list otherwise */}
      {loadingMain && contests.length === 0 ? (
        <YouTubeSkeletonList
          count={5}
          width={"100%"}
          height={60}
          dark={dark}
          contentContainerStyle={{ marginTop: 10, gap: 10 }}
        />
      ) : (
        <FlatList
          data={contests}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderContestListItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            loadingMain && contests.length > 0 ? (
              <ActivityIndicator size={"large"} color={"#aaa"} />
            ) : !loadingMain && contests.length === 0 ? (
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
          contentContainerStyle={{
            paddingBottom: 15,
          }}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum.current) {
              fetchMore();
              onEndReachedCalledDuringMomentum.current = true;
            }
          }}
          onEndReachedThreshold={0.2}
        />
      )}

      <Modal
        visible={showCategories}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategories(false)}
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
  );
};

export default Arena;
