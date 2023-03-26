import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";

export const WorkoutEditSetCard = ({ exerciseName, sets, previousData }) => {
  const [setsData, setSetsData] = useState(sets);

  const addSet = () => {
    const newSet = {
      id: setsData.length + 1,
      weight: "",
      reps: "",
      completed: false,
    };
    setSetsData([...setsData, newSet]);
  };

  const updateSetData = (index, field, value) => {
    const newSetsData = [...setsData];
    newSetsData[index][field] = value;
    setSetsData(newSetsData);
  };

  const toggleCompletion = (index) => {
    const newSetsData = [...setsData];
    newSetsData[index].completed = !newSetsData[index].completed;
    setSetsData(newSetsData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.exerciseName}>{exerciseName}</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Set</Text>
        <Text style={styles.headerText}>Previous</Text>
        <Text style={styles.headerText}>Weight</Text>
        <Text style={styles.headerText}>Reps</Text>
      </View>
      {setsData.map((set, index) => {
        const previous =
          previousData && previousData[index]
            ? `${previousData[index].weight} x ${previousData[index].reps}`
            : "-";
        return (
          <View key={`set-${index}`} style={styles.row}>
            <Text style={styles.value}>{index + 1}</Text>
            <Text style={styles.value}>{previous}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={set.weight.toString()}
              onChangeText={(value) => updateSetData(index, "weight", value)}
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={set.reps.toString()}
              onChangeText={(value) => updateSetData(index, "reps", value)}
            />
            <CheckBox
              value={set.completed}
              onValueChange={() => toggleCompletion(index)}
              tintColors={{ true: "green", false: "gray" }}
            />
          </View>
        );
      })}
      <TouchableOpacity onPress={addSet} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add set</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    width: 50,
    height: 30,
    fontSize: 16,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
