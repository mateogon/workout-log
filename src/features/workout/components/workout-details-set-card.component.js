import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const WorkoutDetailsSetCard = ({ exerciseName, sets }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.exerciseName}>{exerciseName}</Text>
      {sets.map((set, index) => (
        <View key={`set-${index}`} style={styles.setContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Reps:</Text>
            <Text style={styles.value}>{set.reps}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Weight:</Text>
            <Text style={styles.value}>
              {set.weight ? `${set.weight} kg` : "Bodyweight"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  setContainer: {
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
  },
});
