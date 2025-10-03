import { useTheme } from "@/hooks/useThemeContext";
import { Contest, IContestCategory } from "@/services/contest";
import { Media } from "@/services/media";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";
import GetColoredCategoryBubbles from "./coloredCategorybubbles";
import NetworkImage from "./networkImage";
import { YouTubeSkeletonList } from "./skelentonLoader";

interface ICategories {
  close: () => void;
  onSelected: (categories: IContestCategory[]) => void;
}

const Categories = ({ close, onSelected }: ICategories) => {
  const { theme } = useTheme();

  const [stage, setStage] = useState<
    "Categories" | "Sub Categories" | "Filter"
  >("Categories");

  const [categories, setCategories] = useState<IContestCategory[]>([]);
  const [subCategories, setSubCategories] = useState<IContestCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    IContestCategory[]
  >([]);

  // NEW: explicit loading flags
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoadingCategories(true);
    Contest.getCategories(null)
      .then((data) => {
        if (!alive) return;
        setCategories(data ?? []);
      })
      .finally(() => {
        if (alive) setLoadingCategories(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const handleClose = () => {
    if (stage === "Categories") close();
    else setStage("Categories");
  };

  const handleCategorySelected = (category: IContestCategory) => {
    const isMainCategory = category.parentId === null;

    const categoryMap = [...selectedCategories];

    if (isMainCategory) {
      // reset category map if selecting a top-level category
      categoryMap.length = 0;
    }

    categoryMap.push(category);
    setSelectedCategories(categoryMap);

    if (category.hasChildren) {
      // fetch children with a loader
      setSubCategories([]);
      setLoadingSubCategories(true);
      Contest.getCategories(category.id)
        .then((data) => setSubCategories(data ?? []))
        .finally(() => setLoadingSubCategories(false));
      setStage("Sub Categories");
    } else {
      setStage("Filter");
    }
  };

  const handleApply = () => {
    if (selectedCategories.length === 0) {
      close();
      return;
    }
    onSelected(selectedCategories);
  };

  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        bottom: 0,
        backgroundColor: !theme ? "#ffffff" : "#141414",
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
          <View className="">
            <TouchableOpacity
              onPress={handleClose}
              className={` w-[0px] rounded-full`}
              style={{ paddingLeft: 10 }}
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
              fontWeight: "600",
              color: `${!theme ? "#000000" : "#ffffff"}`,
            }}
          >
            {stage}
          </Text>
        </View>
      </View>

      {stage === "Filter" ? (
        <>
          <Text
            style={{
              color: "#8F8F8F",
              fontWeight: "600",
              paddingLeft: 12,
              paddingTop: 5,
              fontSize: 18,
            }}
          >
            Selected Categories
          </Text>
          <Text
            style={{
              color: "#8F8F8F",
              fontWeight: "400",
              paddingLeft: 12,
              paddingTop: 5,
              fontSize: 10,
            }}
          >
            All result from your selections ranging from main to sub categories
          </Text>
          <Text
            style={{
              color: "#8F8F8F",
              fontWeight: "400",
              paddingLeft: 12,
              paddingTop: 5,
              paddingBottom: 16,
              fontSize: 10,
            }}
          >
            <GetColoredCategoryBubbles data={selectedCategories} />
          </Text>
          <TouchableOpacity
            onPress={handleApply}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#3B82F6",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 16,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>
              Apply
            </Text>
          </TouchableOpacity>
        </>
      ) : stage === "Sub Categories" ? (
        <>
          <Text
            style={{
              color: "#8F8F8F",
              fontWeight: "400",
              paddingLeft: 12,
              paddingTop: 5,
              fontSize: 10,
            }}
          >
            {selectedCategories.reduce((prev, curr, index) => {
              return (
                prev +
                curr.name +
                (index < selectedCategories.length - 1 ? ". " : "")
              );
            }, "")}
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 12, paddingBottom: 50 }}
          >
            {loadingSubCategories ? (
              <YouTubeSkeletonList
                count={5}
                width={"100%"}
                height={100}
                dark={theme ?? false}
                contentContainerStyle={{
                  marginTop: 10,
                  gap: 10,
                  marginHorizontal: "auto",
                  width: "90%",
                }}
              />
            ) : subCategories.length > 0 ? (
              <>
                {subCategories.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      borderRadius: 12,
                      marginBottom: 12,
                    }}
                    onPress={() => handleCategorySelected(item)}
                  >
                    <NetworkImage
                      loadingUri={require("../../../assets/images/icon.png")}
                      uri={Media.GetCategoryImageUris(item.id)?.large}
                      style={{
                        width: 100,
                        height: 65,
                        borderRadius: 8,
                        marginRight: 12,
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: !theme ? "#000000" : "#ffffff",
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>
                    {item.hasChildren && (
                      <View
                        style={{
                          width: 31,
                          height: 63,
                          backgroundColor: "#7900FB",
                          borderTopRightRadius: 4,
                          borderBottomRightRadius: 4,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ChevronRightIcon color={"#ffffff"} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <Text
                style={{
                  color: theme ? "#fff" : "#000",
                  opacity: 0.6,
                  textAlign: "center",
                }}
              >
                No sub categories found
              </Text>
            )}
          </ScrollView>
        </>
      ) : (
        // Main Categories
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 0, paddingTop: 10 }}
        >
          {loadingCategories ? (
            <YouTubeSkeletonList
              count={5}
              width={"100%"}
              height={100}
              dark={theme ?? false}
              contentContainerStyle={{
                marginTop: 10,
                gap: 10,
                marginHorizontal: "auto",
                width: "90%",
              }}
            />
          ) : categories.length > 0 ? (
            <>
              {categories.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleCategorySelected(item)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 5,
                  }}
                >
                  <NetworkImage
                    loadingUri={require("../../../assets/images/icon.png")}
                    uri={Media.GetCategoryImageUris(item.id)?.large}
                    style={{
                      width: 100,
                      height: 65,
                      borderRadius: 8,
                      marginRight: 12,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: !theme ? "#000000" : "#ffffff",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        width: 185,
                        height: 30,
                        fontSize: 10,
                        color: "#8F8F8F",
                      }}
                    >
                      {item.description}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 31,
                      height: 63,
                      backgroundColor: "#7900FB",
                      borderTopRightRadius: 4,
                      borderBottomRightRadius: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChevronRightIcon color={"#ffffff"} />
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <Text
              style={{
                color: theme ? "#fff" : "#000",
                opacity: 0.6,
                textAlign: "center",
              }}
            >
              No categories found
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Categories;
