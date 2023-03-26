import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { CheckBox } from "react-native-elements";
import styled from "styled-components/native";

const AddSetButton = styled(TouchableOpacity)`
  background-color: #4caf50;
  border-radius: 4px;
  padding-horizontal: 10px;
  padding-vertical: 5px;
  align-self: center;
  margin-bottom: 16px;
`;

const AddSetText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

export const WorkoutEditSetCard = ({
  exercise,
  exerciseIndex,
  workout,
  setWorkout,
}) => {
  const handleAddSet = () => {
    const newSet = {
      id: exercise.sets.length + 1,
      reps: 0,
      weight: 0,
      completed: false,
    };

    setWorkout({
      ...workout,
      exercises: workout.exercises.map((e, index) =>
        index === exerciseIndex ? { ...e, sets: [...exercise.sets, newSet] } : e
      ),
    });
  };

  const handleSetChange = (setIndex, field, value) => {
    const updatedSets = [...exercise.sets];
    updatedSets[setIndex][field] = value;

    setWorkout({
      ...workout,
      exercises: workout.exercises.map((e, index) =>
        index === exerciseIndex ? { ...e, sets: updatedSets } : e
      ),
    });
  };

  return (
    <View>
      <View>
        <Text>Set</Text>
        <Text>Previous</Text>
        <Text>Weight</Text>
        <Text>Reps</Text>
        <Text>Completed</Text>
      </View>
      {exercise.sets.map((set, setIndex) => (
        <View key={set.id}>
          <Text>{setIndex + 1}</Text>
          <Text>
            {set.previous
              ? `${set.previous.weight} x ${set.previous.reps}`
              : "-"}
          </Text>
          <TextInput
            value={set.weight.toString()}
            onChangeText={(text) =>
              handleSetChange(setIndex, "weight", parseFloat(text))
            }
            keyboardType="numeric"
          />
          <TextInput
            value={set.reps.toString()}
            onChangeText={(text) =>
              handleSetChange(setIndex, "reps", parseInt(text, 10))
            }
            keyboardType="numeric"
          />
          <CheckBox
            checked={set.completed}
            checkedColor="green"
            onPress={() =>
              handleSetChange(setIndex, "completed", !set.completed)
            }
          />
        </View>
      ))}
      <AddSetButton onPress={handleAddSet}>
        <AddSetText>Add Set</AddSetText>
      </AddSetButton>
    </View>
  );
};
