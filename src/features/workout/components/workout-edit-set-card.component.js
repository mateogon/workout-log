import React, { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { CheckBox } from "react-native-elements";
import styled from "styled-components/native";
import { WorkoutsContext } from "../../../services/workouts/workouts.context";

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
const ColumnsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
`;
const SetRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
  const { getExerciseHistory, getPreviousWorkout } =
    useContext(WorkoutsContext);
  const [exerciseHistory, setExerciseHistory] = useState([]);
  useEffect(() => {
    const fetchExerciseHistory = async () => {
      const history = await getExerciseHistory(exercise.id);
      setExerciseHistory(history);
    };

    fetchExerciseHistory();
  }, [exercise.id]);

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
  const getPreviousSetData = (setIndex) => {
    const previousWorkouts = exerciseHistory
      .filter((workout) => new Date(workout.date) < new Date(exercise.date))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log(previousWorkouts);
    if (previousWorkouts.length === 0) {
      return "-";
    }

    const previousWorkout = previousWorkouts[0];

    if (
      previousWorkout &&
      previousWorkout.sets &&
      previousWorkout.sets[setIndex]
    ) {
      const { reps, weight } = previousWorkout.sets[setIndex];

      return `${weight} x ${reps}`;
    }

    return "-";
  };

  return (
    <Container>
      <ColumnsRow>
        <SetColumn>Set</SetColumn>
        <SetColumn>Previous</SetColumn>
        <SetColumn>Weight</SetColumn>
        <SetColumn>Reps</SetColumn>
        <View style={{ flexGrow: 0.55 }} />
      </ColumnsRow>
      {exercise.sets.map((set, setIndex) => (
        <SetRow key={set.id}>
          <SetColumn>{setIndex + 1}</SetColumn>
          <SetColumn>{getPreviousSetData(setIndex)}</SetColumn>
          <SetInput
            keyboardType="numeric"
            value={set.reps.toString()}
            onChangeText={(text) =>
              handleSetChange(setIndex, "reps", parseInt(text))
            }
            placeholder={
              exerciseHistory.length > 0 && exerciseHistory.slice(-1)[0].reps
                ? exerciseHistory.slice(-1)[0].reps.toString()
                : "0"
            }
          />
          <SetInput
            keyboardType="numeric"
            value={set.weight.toString()}
            onChangeText={(text) =>
              handleSetChange(setIndex, "weight", parseInt(text))
            }
            placeholder={
              exerciseHistory.length > 0 && exerciseHistory.slice(-1)[0].weight
                ? exerciseHistory.slice(-1)[0].weight.toString()
                : "0"
            }
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
