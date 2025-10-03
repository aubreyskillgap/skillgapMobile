import { IContestCategory } from "@/services/contest";
import { getRandomTagColor } from "@/services/generateRandomHexNumber";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface IGetColoredCategoryBubbles {
  data: IContestCategory[];
}

const GetColoredCategoryBubbles = ({ data }: IGetColoredCategoryBubbles) => {
  const [bubbles, setBubbles] = useState<any[]>([]);

  useEffect(() => {
    console.log("Contest Changes: ", data);

    if (!data || data.length === 0) {
      setBubbles([]);
      return;
    }

    let prevColor = "";
    const updated = data.map((item) => {
      const color = getRandomTagColor(prevColor);
      prevColor = color.backgroundColor;
      return {
        ...item,
        background: color.backgroundColor,
        border: color.borderColor,
        text: color.textColor,
      };
    });

    setBubbles(updated);
  }, [data]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
          flexWrap: "wrap",
          rowGap: 10,
          columnGap: 20,
          width: "100%",
          paddingBottom: 20,
          paddingTop: 20,
        }}
      >
        {bubbles.map((item: any) => (
          <View
            key={item.id}
            style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
          >
            <TouchableOpacity
              key={item.id}
              style={{
                width: 84,
                height: 32,
                borderStyle: "dashed",
                borderColor: item.border,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderRadius: 16,
                backgroundColor: item.background,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: item.text,
                  fontSize: 10,
                  fontWeight: "500",
                  width: 65,
                  textAlign: "center",
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </>
  );
};

export default GetColoredCategoryBubbles;
