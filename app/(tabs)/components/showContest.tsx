import { useTheme } from "@/hooks/useThemeContext";
import { Contest, IContest } from "@/services/contest";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Nodata } from "../mainApp";
import { ContestListItem } from "./contest/contestListItem";
import { YouTubeSkeletonList } from "./skelentonLoader";
interface ShowContestProps {
  refreshing: boolean;
}

let currentPage = 0;
const PAGE_SIZE = 10;

const ShowContest: React.FC<ShowContestProps> = (refreshing) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [contests, setContests] = useState<IContest[]>([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);
  const onEndReachedCalledDuringMomentum = useRef(false);

  async function getMyContestList() {
    if (loading || isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const data = await Contest.getMyContests(nextPage); // expect array
      if (data.length === 0) {
        setHasMore(false);
        return;
      }
      setContests((prev) => {
        const merged = [...prev, ...data];
        const seen = new Set<string | number>();
        return merged.filter((x) => {
          const k = x.id;
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
      });
      currentPage = nextPage;
      if (data.length < PAGE_SIZE) setHasMore(false);
    } catch (e) {
      console.warn("Failed to load contests", e);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }

  useFocusEffect(
    useCallback(() => {
      // Reset on focus or when `refreshing` changes
      currentPage = 0;
      setHasMore(true);
      getMyContestList();
    }, [refreshing])
  );

  if (loading && contests.length === 0) {
    return (
      <YouTubeSkeletonList
        count={10}
        width={"100%"}
        height={60}
        dark={theme ?? false}
        listDirection={false}
        contentContainerStyle={{ marginTop: 10, gap: 10 }}
      />
    );
  }

  const renderMyContestItem = ({ item }: { item: IContest }) => (
    <ContestListItem contest={item} />
  );

  return (
    <>
      <View
        style={{
          borderRadius: 100,
          flexDirection: "row",
          width: 200,
          overflow: "hidden",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontFamily: "General Sans Variable",
            fontStyle: "normal",
            fontWeight: "700", // font-semibold
            fontSize: 16, // text-base
            letterSpacing: -0.16, // ~-0.01em
            color: theme == false ? "#020B12" : "#8F8F8F",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          My Contest
        </Text>
      </View>
      <View style={{ height: hp("28%") }}>
        <FlatList
          data={contests}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMyContestItem}
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
            loading && contests.length > 0 ? (
              <ActivityIndicator size="small" />
            ) : hasMore ? null : (
              // Optional “end of list” marker
              <Text style={{ textAlign: "center", padding: 12, opacity: 0.6 }}>
                No more contests
              </Text>
            )
          }
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </View>
    </>
  );
};

export default ShowContest;
