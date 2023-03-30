import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { CheckBox } from "react-native-elements";
import styled from "styled-components/native";

const AddSetButton = styled(TouchableOpacity)`
  background-color: #6200ee;
  border-radius: 4px;
  padding-horizontal: 10px;
  padding-vertical: 5px;
  align-self: center;
  margin-bottom: 16px;
`;

const AddSetText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 400;
`;

const SetRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
`;

const SetInput = styled.TextInput`
  background-color: #c5c5c5;
  border-radius: 4px;
  width: 60px;
  padding-horizontal: 5px;
  text-align: center;
`;
const SetColumn = styled.Text`
  width: 60px;
  text-align: center;
`;
const Container = styled.View`
  padding-top: 8px;
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
    <Container>
      <SetRow>
        <SetColumn>Set</SetColumn>
        <SetColumn>Previous</SetColumn>
        <SetColumn>Weight</SetColumn>
        <SetColumn>Reps</SetColumn>
        <View style={{ flexGrow: 0.55 }} />
      </SetRow>
      {exercise.sets.map((set, setIndex) => (
        <SetRow key={set.id}>
          <SetColumn>{setIndex + 1}</SetColumn>
          <SetColumn>
            {set.previous
              ? `${set.previous.weight} x ${set.previous.reps}`
              : "-"}
          </SetColumn>
          <SetInput
            value={set.weight.toString()}
            onChangeText={(text) =>
              handleSetChange(setIndex, "weight", parseFloat(text))
            }
            keyboardType="numeric"
          />
          <SetInput
            value={set.reps.toString()}
            onChangeText={(text) =>
              handleSetChange(setIndex, "reps", parseInt(text, 10))
            }
            keyboardType="numeric"
          />
          <CheckBox
            checked={set.completed}
            uncheckedColor="grey"
            checkedColor="green"
            onPress={() =>
              handleSetChange(setIndex, "completed", !set.completed)
            }
          />
        </SetRow>
      ))}
      <AddSetButton onPress={handleAddSet}>
        <AddSetText>Add Set</AddSetText>
      </AddSetButton>
    </Container>
  );
};
