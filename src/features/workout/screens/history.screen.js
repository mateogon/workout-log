import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { WorkoutsContext } from "../../../services/workouts/workouts.context";
export const HistoryScreen = ({ navigation }) => {
  const { workouts, createWorkout } = useContext(WorkoutsContext);

  const renderWorkoutCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.workoutCard}
        onPress={() =>
          navigation.navigate("WorkoutDetails", { workoutId: item.id })
        }
      >
        <Text style={styles.workoutCardTitle}>{item.name}</Text>
        <Text style={styles.workoutCardSubtitle}>
          {item.exercises.length} exercises
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeArea>
      <View style={styles.container}>
        <FlatList
          data={workouts}
          renderItem={renderWorkoutCard}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  createWorkoutButton: {
    backgroundColor: "#6200EE",
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  createWorkoutButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  workoutCard: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 5,
    marginBottom: 8,
  },
  workoutCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  workoutCardSubtitle: {
    fontSize: 14,
    color: "#999999",
  },
});
