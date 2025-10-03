import { useTheme } from "@/hooks/useThemeContext";
import { Contest, ITrendingCategory } from "@/services/contest";
import { Media } from "@/services/media";
import { Router } from "@/services/router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import NetworkImage from "./networkImage";
import { YouTubeSkeletonCard } from "./skelentonLoader"; // <-- use Card for horizontal skeleton

interface TrendingCategoryProps {
  refreshing: boolean;
}

const TrendingCategory: React.FC<TrendingCategoryProps> = ({ refreshing }) => {
  // <-- FIXED destructuring
  const { theme } = useTheme();

  const [categories, setCategories] = useState<ITrendingCategory[]>([]);
  const [loading, setLoading] = useState(true); // <-- track loading

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Contest.getTrendingCategories()
      .then((data) => {
        if (!alive) return;
        setCategories(data ?? []);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [refreshing]);

  const routeToArena = (category: ITrendingCategory) => {
    Router.push(
      `/(tabs)/mainApp/arena?categoryId=${category.id}&categoryName=${category.name}`
    );
  };

  return (
    <View
      style={{
        paddingTop: 16,
        marginBottom: 12,
        backgroundColor: "transparent",
      }}
    >
      <Text
        style={{
          fontWeight: "500",
          fontSize: 18,
          color: theme == false ? "#020B12" : "#ffffff",
        }}
      >
        Trending Categories
      </Text>

      <View style={{ flexDirection: "row" }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* SHOW SKELETON WHILE LOADING */}
          {loading ? (
            <View
              style={{ flexDirection: "row", paddingBottom: 5, marginTop: 10 }}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <YouTubeSkeletonCard
                  key={`tc-skel-${i}`}
                  dark={theme !== false}
                  width={130}
                  height={80}
                  radius={5}
                  containerStyle={{ marginRight: 10 }}
                />
              ))}
            </View>
          ) : categories.length > 0 ? (
            <View style={{ flexDirection: "row", paddingBottom: 5 }}>
              {categories.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => routeToArena(item)}
                >
                  <View
                    style={{
                      padding: 4,
                      paddingLeft: 8,
                      paddingRight: 8,
                      paddingTop: 10,
                      backgroundColor: theme == false ? "#ffffff" : "#27292B",
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                  >
                    <NetworkImage
                      loadingUri={require("../../../assets/images/icon.png")}
                      uri={Media.GetCategoryImageUris(item.id)?.large}
                      style={{
                        width: 130,
                        height: 80,
                        borderRadius: 2,
                        resizeMode: "cover",
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color: theme == false ? "#020B12" : "#ffffff",
                        width: 125,
                        fontWeight: 700 as any, // RN numeric weights are fine at runtime
                        fontSize: 14,
                      }}
                    >
                      {item.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          color: theme == false ? "#000000" : "#8F8F8F",
                          fontSize: 10,
                          fontWeight: 400 as any,
                        }}
                      >
                        <Text
                          style={{
                            color: theme == false ? "#000000" : "#ffffff",
                            fontSize: 12,
                          }}
                        >
                          Contests:{" "}
                        </Text>
                        {item.contests}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            // Optional: empty state when not loading and no categories
            <Text
              style={{
                color: theme == false ? "#020B12" : "#ffffff",
                opacity: 0.6,
                marginTop: 12,
              }}
            >
              No trending categories right now
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default TrendingCategory;
