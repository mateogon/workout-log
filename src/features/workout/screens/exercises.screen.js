import React, { useContext } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ExerciseContext } from "../../../services/exercises/exercises.context";

export const ExercisesScreen = ({ route, navigation }) => {
  const { exercises, addExercise, removeExercise } =
    useContext(ExerciseContext);
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log("clicked exercise ");
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
