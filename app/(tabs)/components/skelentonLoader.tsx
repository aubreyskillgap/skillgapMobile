// YouTubeSkeleton.tsx
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useEffect, useRef, useState } from "react";
import type { DimensionValue, StyleProp } from "react-native";
import {
  Animated,
  Easing,
  FlatList,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type ShimmerProps = {
  style?: StyleProp<ViewStyle>;
  dark?: boolean;
  radius?: number;
};

const Shimmer = memo(({ style, dark = false, radius = 8 }: ShimmerProps) => {
  const [width, setWidth] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1300,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: true,
      })
    ).start();
  }, [anim]);

  const gradientWidth = 160;
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-gradientWidth, (width || 300) + gradientWidth],
  });

  const base = dark ? "#262626" : "#E7E7E7";
  return (
    <View
      style={[
        { backgroundColor: base, overflow: "hidden", borderRadius: radius },
        style,
      ]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      pointerEvents="none"
    >
      <Animated.View
        style={[StyleSheet.absoluteFillObject, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[
            "rgba(255,255,255,0)",
            dark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.45)",
            "rgba(255,255,255,0)",
          ]}
          style={{ width: gradientWidth, height: "100%" }}
        />
      </Animated.View>
    </View>
  );
});

type CardProps = {
  dark?: boolean;
  width?: DimensionValue; // <- use RN’s DimensionValue
  height?: DimensionValue; // <- same here
  radius?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

export const YouTubeSkeletonCard = memo(
  ({
    dark = false,
    width = "100%",
    height = 200,
    radius = 10,
    containerStyle,
  }: CardProps) => {
    return (
      <View style={[styles.card, containerStyle]}>
        <Shimmer dark={dark} style={{ width, height, borderRadius: radius }} />
      </View>
    );
  }
);

type ListProps = {
  count?: number;
  dark?: boolean;
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  cardStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  listDirection?: boolean;
};

export const YouTubeSkeletonList = ({
  count = 6,
  dark = false,
  width = "100%",
  height = 200,
  radius = 10,
  cardStyle,
  contentContainerStyle,
  listDirection,
}: ListProps) => {
  const data = Array.from({ length: count }, (_, i) => i);
  return (
    <FlatList
      horizontal={listDirection}
      data={data}
      keyExtractor={(i) => `yt-skel-${i}`}
      renderItem={() => (
        <YouTubeSkeletonCard
          dark={dark}
          width={width}
          height={height}
          radius={radius}
          containerStyle={cardStyle}
        />
      )}
      contentContainerStyle={[{}, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },
});
