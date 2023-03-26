import React from "react";
import { View, Text } from "react-native";

export const rightSwipeActions = () => {
  return (
    <View
      style={{
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "flex-end",
        marginBottom: 10,
        borderRadius: 5,
      }}
    >
      <Text
        style={{
          color: "#1b1a17",

          fontWeight: "600",
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}
      >
        Delete
      </Text>
    </View>
  );
};
