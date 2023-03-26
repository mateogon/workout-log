import React, { useContext } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ExerciseContext } from "../../../services/exercises/exercises.context";

export const ExercisePickerScreen = ({
  route: {
    params: { onExerciseSelected },
  },
  navigation,
}) => {
  const { exercises, addExercise, removeExercise } =
    useContext(ExerciseContext);
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onExerciseSelected(item);
          navigation.goBack();
        }}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
